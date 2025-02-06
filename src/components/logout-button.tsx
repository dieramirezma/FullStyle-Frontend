'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

function LogoutButton () {
  return (
    <button onClick={async () => { await signOut({ callbackUrl: '/login' }) }}>
      <LogOut size={30} color='#EBA745'/>
    </button>
  )
}

export default LogoutButton
