import type { Metadata } from 'next'
import '@/app/globals.css'
import Link from 'next/link'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar, type NavigationItem } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import React from 'react'

export const metadata: Metadata = {
  title: 'FullStyle - Dueños'
}

const navigation: NavigationItem[] = [
  {
    title: 'Home',
    href: '/owner',
    icon: 'Home' as const
  },
  {
    title: 'Perfil',
    href: '/owner/profile',
    icon: 'UserCircle' as const
  },
  {
    title: 'Negocio',
    href: '/owner/business',
    icon: 'Briefcase' as const
  },
  {
    title: 'Servicios',
    href: '/owner/services',
    icon: 'Settings' as const
  },
  {
    title: 'Empleados',
    href: '/owner/employees',
    icon: 'Users' as const
  }
  // {
  //   title: 'Historial de reservas',
  //   href: '/owner/appointments',
  //   icon: 'Calendar' as const
  // }
]

export default function OwnerLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar items={navigation} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex flex-1 items-center justify-center">
            <Link href="/" className="hidden font-semibold md:block title">
              FullStyle
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
