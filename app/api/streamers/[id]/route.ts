import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET - 获取单个主播
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const streamer = await prisma.streamer.findUnique({
      where: { id: params.id },
    })

    if (!streamer) {
      return NextResponse.json({ error: '主播不存在' }, { status: 404 })
    }

    return NextResponse.json(streamer)
  } catch (error) {
    console.error('获取主播失败:', error)
    return NextResponse.json({ error: '获取主播失败' }, { status: 500 })
  }
}

// PUT - 更新主播
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const updateData: any = {}
    
    if (body.wechatId !== undefined) updateData.wechatId = body.wechatId
    if (body.wechatName !== undefined) updateData.wechatName = body.wechatName
    if (body.streamerName !== undefined) updateData.streamerName = body.streamerName
    if (body.liveUrl !== undefined) updateData.liveUrl = body.liveUrl
    if (body.platform !== undefined) updateData.platform = body.platform
    if (body.isCustom !== undefined) updateData.isCustom = body.isCustom
    if (body.fee !== undefined) updateData.fee = new Prisma.Decimal(body.fee)
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate)
    if (body.expireDate !== undefined) updateData.expireDate = new Date(body.expireDate)
    if (body.status !== undefined) updateData.status = body.status

    const streamer = await prisma.streamer.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(streamer)
  } catch (error) {
    console.error('更新主播失败:', error)
    return NextResponse.json({ error: '更新主播失败' }, { status: 500 })
  }
}

// DELETE - 删除主播
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.streamer.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除主播失败:', error)
    return NextResponse.json({ error: '删除主播失败' }, { status: 500 })
  }
}

