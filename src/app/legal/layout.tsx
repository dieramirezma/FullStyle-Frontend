import type { Metadata } from 'next'
import '@/app/globals.css'
import Link from 'next/link'
import { UserIcon } from '@/components/icons/user'

export const metadata: Metadata = {
  title: 'FullStyle - Clientes'
}

export default function BlogLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section>
      <header className='flex w-full justify-between items-center bg-background rounded-lg mx-4 mt-4 px-8 border-b-2'>
      <div className='hidden md:block'>
        <Link
          href='/'
          className='title'
        >
          FullStyle
        </Link>
      </div>
      <Link href='/'>
        <UserIcon width={40}/>
      </Link>
    </header>
      <main>{children}</main>
    </section>
  )
}
