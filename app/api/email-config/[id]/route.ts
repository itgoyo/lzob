import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - 更新邮箱配置
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, email, smtpHost, smtpPort, smtpUser, smtpPass, isActive } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (smtpHost !== undefined) updateData.smtpHost = smtpHost
    if (smtpPort !== undefined) updateData.smtpPort = parseInt(smtpPort)
    if (smtpUser !== undefined) updateData.smtpUser = smtpUser
    if (smtpPass !== undefined) updateData.smtpPass = smtpPass
    if (isActive !== undefined) updateData.isActive = isActive

    const config = await prisma.emailConfig.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('更新邮箱配置失败:', error)
    return NextResponse.json({ error: '更新配置失败' }, { status: 500 })
  }
}

// DELETE - 删除邮箱配置
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.emailConfig.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: '删除成功' })
  } catch (error) {
    console.error('删除邮箱配置失败:', error)
    return NextResponse.json({ error: '删除配置失败' }, { status: 500 })
  }
}

