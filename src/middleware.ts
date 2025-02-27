import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'
import apiClient from './utils/apiClient'

export async function middleware (req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const { pathname } = req.nextUrl
  // api/subscription
  try {
    const response = await apiClient.get(`subscription/${token?.id as number}`)

    if (pathname.startsWith('/owner') && response.data.subscription_active === false) {
      return NextResponse.redirect(new URL('/plans', req.url))
    } else if (response.data.subscription_active && pathname.startsWith('/plans')) {
      return NextResponse.redirect(new URL('/owner', req.url))
    }
  } catch (error) {
    console.error('Error al obtener la suscripción:', error)
  }

  // Si no hay token, redirige al login
  if (token == null) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  console.log('Token:', pathname.startsWith('/plans'))
  if (pathname.startsWith('/plans') && token.subscriptionactive === true) {
    return NextResponse.redirect(new URL('/owner', req.url))
  }

  if ((pathname.startsWith('/owner') || pathname.startsWith('/plans')) && !token.is_manager) {
    return NextResponse.redirect(new URL('/customer', req.url))
  }

  if ((pathname.startsWith('/customer')) && token.is_manager) {
    return NextResponse.redirect(new URL('/owner', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/customer/:path*', '/owner/:path*', '/plans/:path*']
}
