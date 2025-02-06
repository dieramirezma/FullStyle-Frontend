'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

function LogoutButton () {
  return (
    <Button
      variant='ghost'
      className={cn('h-7 w-7 [&_svg]:size-6')}
      onClick={async () => { await signOut({ callbackUrl: '/login' }) }}
    >
      <LogOut size={30} />
    </Button>
  )
}

export default LogoutButton
