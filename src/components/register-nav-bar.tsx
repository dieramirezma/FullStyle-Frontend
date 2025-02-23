import { buttonVariants } from './ui/button'
import Link from 'next/link'

function RegisterNavBar () {
  return (
    <header className="w-full border-b-2 bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="title tracking-tight hover:text-primary/90">
          FullStyle
        </Link>

        <Link
          href={'/'}
          className={buttonVariants({
            variant: 'default',
            className: 'whitespace-nowrap text-sm sm:text-base'
          })}
        >
          Regresa al inicio
        </Link>
      </div>
    </header>
  )
}

export default RegisterNavBar
