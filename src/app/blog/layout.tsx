import type { Metadata } from 'next'
import '@/app/globals.css'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'FullStyle - Blog',
  description: 'Últimas tendencias en estética, belleza y peluquería. Descubre los mejores consejos y trucos para cuidar tu imagen y sentirte bien contigo misma.'
  // keywords: ['estética', 'belleza', 'peluquería', 'salón de belleza']
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
      <Link
        href={'/'}
        className={buttonVariants({ variant: 'default' })}
      >
        Regresa al inicio
      </Link>
    </header>
      <main>{children}</main>
    </section>
  )
}
