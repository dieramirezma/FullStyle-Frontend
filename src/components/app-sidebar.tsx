'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar'
import { Home, Users, Briefcase, UserCircle, Settings, Calendar, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

const icons = { Home, Settings, Users, UserCircle, Briefcase, Calendar }

export interface NavigationItem {
  title: string
  href: string
  icon: keyof typeof icons
}

interface SidebarProps {
  items: NavigationItem[]
}

export function AppSidebar ({ items }: SidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Settings className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{session?.user.name}</span>
                  <span className="text-xs text-muted-foreground">Panel de Control { session?.user.is_manager ? 'Gerente' : 'Cliente' }</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='ml-2'>
        <SidebarMenu>
          {items.map((item) => {
            const IconComponent = icons[item.icon]

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <IconComponent className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='ml-2'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                await signOut({ callbackUrl: '/login' })
              }}
              className="text-red-500 hover:text-red-600 bg-red-200 hover:bg-red-900/50"
            >
              <LogOut className="size-4" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
