import { NextResponse } from 'next/server'
import { clearLoginStatus } from '@/lib/auth'

export async function POST() {
  try {
    await clearLoginStatus()

    return NextResponse.json({
      success: true,
      message: '退出登录成功',
    })
  } catch (error) {
    console.error('退出登录失败:', error)
    return NextResponse.json(
      { error: '退出登录失败' },
      { status: 500 }
    )
  }
}

