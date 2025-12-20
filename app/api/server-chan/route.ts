import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - 获取所有Server酱配置
export async function GET() {
  try {
    const configs = await prisma.serverChan.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(configs)
  } catch (error) {
    console.error('获取Server酱配置失败:', error)
    return NextResponse.json({ error: '获取配置失败' }, { status: 500 })
  }
}

// POST - 创建新的Server酱配置
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, sendKey, isActive } = body

    if (!name || !sendKey) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 })
    }

    const config = await prisma.serverChan.create({
      data: {
        name,
        sendKey,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(config, { status: 201 })
  } catch (error) {
    console.error('创建Server酱配置失败:', error)
    return NextResponse.json({ error: '创建配置失败' }, { status: 500 })
  }
}

