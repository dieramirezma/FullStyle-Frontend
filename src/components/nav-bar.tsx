'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'

function NavBar () {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)

  const { data: session } = useSession()

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setHidden(true)
      } else {
        setHidden(false)
      }
      lastScrollY = window.scrollY
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-sm border-b transition-transform duration-300',
        hidden ? '-translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="container px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - visible en todas las pantallas */}
          <Link href="/" className="title">
            FullStyle
          </Link>

          {/* Navegación de escritorio */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#hero">
              Inicio
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#services">
              Servicios
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#contact">
              Contacto
            </Link>
          </nav>

          {/* Botones de autenticación para escritorio */}
          <div className="hidden md:flex items-center space-x-4">
            {session
              ? (
                <Link
                  href={session.user.is_manager ? '/owner' : '/customer'}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  IR AL DASHBOARD
                </Link>
                )
              : (
                <Link
                  href="/login"
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  LOGIN
                </Link>
                )}
            <Link href="/register" className={buttonVariants({ variant: 'default', size: 'sm' })}>
              SOLICITA UNA DEMO
            </Link>
          </div>

          {/* Botón de menú móvil */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={cn(
          'fixed inset-x-0 top-16 bg-background border-b md:hidden transition-all duration-300 ease-in-out',
          isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        )}
      >
        <div className="container px-4 py-4 flex flex-col space-y-4">
          <nav className="flex flex-col space-y-4">
            <Link
              className="text-sm font-medium hover:text-primary transition-colors px-4 py-2 rounded-md hover:bg-muted"
              href="#hero"
              onClick={() => { setIsMenuOpen(false) }}
            >
              Inicio
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors px-4 py-2 rounded-md hover:bg-muted"
              href="#services"
              onClick={() => { setIsMenuOpen(false) }}
            >
              Servicios
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary transition-colors px-4 py-2 rounded-md hover:bg-muted"
              href="#contact"
              onClick={() => { setIsMenuOpen(false) }}
            >
              Contacto
            </Link>
          </nav>

          <div className="grid gap-2 pt-4 border-t">
              {session
                ? (
                <Link
                  href={session.user.is_manager ? '/owner' : '/customer'}
                  className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
                  onClick={() => { setIsMenuOpen(false) }}
                >
                  IR AL DASHBOARD
                </Link>
                  )
                : (
                <Link
                  href="/login"
                  className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
                  onClick={() => { setIsMenuOpen(false) }}
                >
                  LOGIN
                </Link>
                  )}
            <Link
              href="/register"
              className={buttonVariants({ variant: 'default', size: 'sm', className: 'w-full' })}
              onClick={() => { setIsMenuOpen(false) }}
            >
              SOLICITA UNA DEMO
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default NavBar
