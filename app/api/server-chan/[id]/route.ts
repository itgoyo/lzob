import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - 更新Server酱配置
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, sendKey, isActive } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (sendKey !== undefined) updateData.sendKey = sendKey
    if (isActive !== undefined) updateData.isActive = isActive

    const config = await prisma.serverChan.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('更新Server酱配置失败:', error)
    return NextResponse.json({ error: '更新配置失败' }, { status: 500 })
  }
}

// DELETE - 删除Server酱配置
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.serverChan.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除Server酱配置失败:', error)
    return NextResponse.json({ error: '删除配置失败' }, { status: 500 })
  }
}

