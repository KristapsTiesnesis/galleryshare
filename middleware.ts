import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const protectedPaths = [/^\/galleries(\/.*)?$/, /^\/upload(\/.*)?$/]
  const isProtected = protectedPaths.some((re) => re.test(request.nextUrl.pathname))
  if (!isProtected) return NextResponse.next()

  // Rely on NextAuth session cookie; redirect if unauthenticated
  const hasSessionCookie = request.cookies.has('next-auth.session-token') || request.cookies.has('__Secure-next-auth.session-token')
  if (!hasSessionCookie) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/galleries/:path*', '/upload/:path*']
}


