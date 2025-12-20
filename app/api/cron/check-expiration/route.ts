import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import axios from 'axios'
import { formatDate } from '@/lib/utils'
import { sendEmail, generateExpirationEmailHTML } from '@/lib/email'
import { platformNames } from '@/lib/types'

// 发送 Server酱 通知
async function sendServerChanNotification(sendKey: string, title: string, content: string) {
  try {
    await axios.post(`https://sctapi.ftqq.com/${sendKey}.send`, {
      title,
      desp: content,
    })
    return true
  } catch (error) {
    console.error('发送Server酱通知失败:', error)
    return false
  }
}

// GET - 检查过期主播并发送通知
export async function GET(request: NextRequest) {
  try {
    // 验证 cron secret
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const now = new Date()
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

    // 查找已过期但状态还是ACTIVE的主播
    const expiredStreamers = await prisma.streamer.findMany({
      where: {
        expireDate: {
          lt: now,
        },
        status: 'ACTIVE',
      },
    })

    // 更新状态为EXPIRED
    if (expiredStreamers.length > 0) {
      await prisma.streamer.updateMany({
        where: {
          id: {
            in: expiredStreamers.map(s => s.id),
          },
        },
        data: {
          status: 'EXPIRED',
        },
      })
    }

    // 查找已过期且需要发送通知的主播
    const streamersToNotify = await prisma.streamer.findMany({
      where: {
        expireDate: {
          lt: now,
        },
        status: 'EXPIRED',
      },
      include: {
        notifications: {
          orderBy: {
            sentAt: 'desc',
          },
          take: 1,
        },
      },
    })

    // 过滤出2小时前已发送通知或从未发送通知的主播
    const streamersNeedNotification = streamersToNotify.filter(streamer => {
      if (streamer.notifications.length === 0) return true
      const lastNotification = streamer.notifications[0]
      return lastNotification.sentAt < twoHoursAgo
    })

    // 获取所有启用的Server酱配置
    const serverChanConfigs = await prisma.serverChan.findMany({
      where: { isActive: true },
    })

    // 获取所有启用的邮箱配置
    const emailConfigs = await prisma.emailConfig.findMany({
      where: { isActive: true },
    })

    let notificationsSent = 0

    // 发送通知
    for (const streamer of streamersNeedNotification) {
      const title = `主播到期提醒: ${streamer.streamerName}`
      const content = `
**微信ID**: ${streamer.wechatId}

**微信名字**: ${streamer.wechatName}

**主播名字**: ${streamer.streamerName}

**直播地址**: ${streamer.liveUrl}

**直播平台**: ${streamer.platform}

**是否定制**: ${streamer.isCustom ? '是' : '否'}

**收费**: ¥${streamer.fee}

**开始时间**: ${formatDate(streamer.startDate)}

**到期时间**: ${formatDate(streamer.expireDate)}

---
该主播已到期，请及时处理！
      `.trim()

      // 向所有启用的Server酱发送通知
      for (const config of serverChanConfigs) {
        const success = await sendServerChanNotification(config.sendKey, title, content)
        if (success) {
          notificationsSent++
        }
      }

      // 向所有启用的邮箱发送通知
      const emailData = {
        wechatId: streamer.wechatId,
        wechatName: streamer.wechatName,
        streamerName: streamer.streamerName,
        liveUrl: streamer.liveUrl,
        platform: platformNames[streamer.platform],
        isCustom: streamer.isCustom,
        fee: String(streamer.fee),
        startDate: formatDate(streamer.startDate),
        expireDate: formatDate(streamer.expireDate),
      }
      
      const emailHTML = generateExpirationEmailHTML(emailData)
      
      for (const config of emailConfigs) {
        const success = await sendEmail(
          {
            email: config.email,
            smtpHost: config.smtpHost,
            smtpPort: config.smtpPort,
            smtpUser: config.smtpUser,
            smtpPass: config.smtpPass,
          },
          config.email,
          title,
          emailHTML
        )
        if (success) {
          notificationsSent++
        }
      }

      // 记录通知
      await prisma.notification.create({
        data: {
          streamerId: streamer.id,
          content: `${title}\n\n${content}`,
        },
      })
    }

    return NextResponse.json({
      message: '检查完成',
      expiredCount: expiredStreamers.length,
      notificationsSent,
      streamersNotified: streamersNeedNotification.length,
    })
  } catch (error) {
    console.error('检查过期主播失败:', error)
    return NextResponse.json({ error: '检查失败' }, { status: 500 })
  }
}

