import type { Metadata } from 'next'
import '@/app/globals.css'
import Link from 'next/link'
import { AppSidebar, type NavigationItem } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'FullStyle - Clientes'
}

const navigation: NavigationItem[] = [
  {
    title: 'Home',
    href: '/customer',
    icon: 'Home' as const
  },
  {
    title: 'Mis reservas',
    href: '/customer/appointments',
    icon: 'Calendar' as const
  },
  {
    title: 'Perfil',
    href: '/customer/profile',
    icon: 'UserCircle' as const
  }
]

export default function BlogLayout ({
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
