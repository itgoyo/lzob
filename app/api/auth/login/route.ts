import { NextRequest, NextResponse } from 'next/server'
import { validateCredentials, setLoginStatus } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '请输入用户名和密码' },
        { status: 400 }
      )
    }

    // 验证凭据
    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        { error: '用户名或密码错误' },
        { status: 401 }
      )
    }

    // 设置登录状态
    await setLoginStatus(username)

    return NextResponse.json({
      success: true,
      message: '登录成功',
      username,
    })
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      { error: '登录失败，请重试' },
      { status: 500 }
    )
  }
}

