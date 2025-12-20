import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET - 获取主播列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') // 'ACTIVE' | 'EXPIRED' | null
    const sortBy = searchParams.get('sortBy') || 'expireDate'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    const where: Prisma.StreamerWhereInput = status
      ? { status: status as 'ACTIVE' | 'EXPIRED' }
      : {}

    const streamers = await prisma.streamer.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

    return NextResponse.json(streamers)
  } catch (error) {
    console.error('获取主播列表失败:', error)
    return NextResponse.json({ error: '获取主播列表失败' }, { status: 500 })
  }
}

// POST - 创建新主播
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      wechatId,
      wechatName,
      streamerName,
      liveUrl,
      platform,
      isCustom,
      fee,
      startDate,
      expireDate,
    } = body

    // 验证必填字段
    if (!wechatId || !wechatName || !streamerName || !liveUrl || !platform || fee === undefined) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    const streamer = await prisma.streamer.create({
      data: {
        wechatId,
        wechatName,
        streamerName,
        liveUrl,
        platform,
        isCustom: isCustom || false,
        fee: new Prisma.Decimal(fee),
        startDate: new Date(startDate || Date.now()),
        expireDate: new Date(expireDate || Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'ACTIVE',
      },
    })

    return NextResponse.json(streamer, { status: 201 })
  } catch (error) {
    console.error('创建主播失败:', error)
    return NextResponse.json({ error: '创建主播失败' }, { status: 500 })
  }
}

