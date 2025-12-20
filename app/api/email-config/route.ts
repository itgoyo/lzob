import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取所有邮箱配置
export async function GET() {
  try {
    const configs = await prisma.emailConfig.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(configs)
  } catch (error) {
    console.error('获取邮箱配置失败:', error)
    return NextResponse.json({ error: '获取配置失败' }, { status: 500 })
  }
}

// POST - 创建新的邮箱配置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, smtpHost, smtpPort, smtpUser, smtpPass, isActive } = body

    if (!name || !email || !smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    const config = await prisma.emailConfig.create({
      data: {
        name,
        email,
        smtpHost,
        smtpPort: parseInt(smtpPort),
        smtpUser,
        smtpPass,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(config, { status: 201 })
  } catch (error) {
    console.error('创建邮箱配置失败:', error)
    return NextResponse.json({ error: '创建配置失败' }, { status: 500 })
  }
}

