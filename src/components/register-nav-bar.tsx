import { buttonVariants } from './ui/button'
import Link from 'next/link'

function RegisterNavBar () {
  return (
    <header className='flex w-full justify-between items-center bg-background rounded-lg mx-4 mt-4 px-8 border-b-2 mb-6'>
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
  )
}

export default RegisterNavBar
