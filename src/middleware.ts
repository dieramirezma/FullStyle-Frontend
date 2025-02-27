import { getToken } from 'next-auth/jwt'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware (req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const { pathname } = req.nextUrl
  // api/subscription
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}subscription/${token?.id as number}`)

    if (!response.ok) {
      throw new Error(`Error al obtener suscripción: ${response.status}`)
    }

    const data = await response.json()

    if (pathname.startsWith('/owner') && data.subscription_active === false) {
      return NextResponse.redirect(new URL('/plans', req.url))
    } else if (data.subscription_active && pathname.startsWith('/plans')) {
      return NextResponse.redirect(new URL('/owner', req.url))
    }
  } catch (error) {
    console.error('Error en el middleware:', error)
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
