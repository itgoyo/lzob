import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE_NAME = 'admin-logged-in'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get(AUTH_COOKIE_NAME)?.value === 'true'
  const { pathname } = request.nextUrl

  // 登录页面，如果已登录则重定向到首页
  if (pathname === '/login') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // API 路由保护
  if (pathname.startsWith('/api')) {
    // 认证相关的 API 不需要验证
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next()
    }
    
    // 其他 API 需要登录
    if (!isLoggedIn) {
      return NextResponse.json(
        { error: '未授权访问，请先登录' },
        { status: 401 }
      )
    }
    return NextResponse.next()
  }

  // 其他页面保护
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}

