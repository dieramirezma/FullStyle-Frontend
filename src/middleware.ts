import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware (req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const { pathname } = req.nextUrl

  // Si no hay token, redirige al login
  if (token == null) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname.startsWith('/owner') && !token.is_manager) {
    return NextResponse.redirect(new URL('/customer', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/customer/:path*', '/owner/:path*']
}
