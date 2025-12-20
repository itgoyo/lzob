import { cookies } from 'next/headers'

const AUTH_COOKIE_NAME = 'admin-logged-in'
const AUTH_COOKIE_VALUE = 'true'

// 验证用户凭据
export function validateCredentials(username: string, password: string): boolean {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

  console.log('验证凭据:', {
    输入用户名: username,
    配置用户名: adminUsername,
    密码匹配: password === adminPassword
  })

  return username === adminUsername && password === adminPassword
}

// 设置登录状态
export async function setLoginStatus(username: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7天
    path: '/',
  })
  
  // 同时设置用户名
  cookieStore.set('admin-username', username, {
    httpOnly: false, // 允许前端读取
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

// 检查是否已登录
export async function isLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME)
  return authCookie?.value === AUTH_COOKIE_VALUE
}

// 获取当前用户名
export async function getCurrentUser(): Promise<string | null> {
  const cookieStore = await cookies()
  const username = cookieStore.get('admin-username')
  return username?.value || null
}

// 清除登录状态
export async function clearLoginStatus() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
  cookieStore.delete('admin-username')
}

