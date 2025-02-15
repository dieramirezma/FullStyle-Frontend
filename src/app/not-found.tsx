import RegisterNavBar from '@/components/register-nav-bar'
import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFoundPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-stretch justify-center px-20 py-8 gap-8">
        <div className="flex-1 max-w-[50%] flex items-center">
          <Image
            src="/images/error404.jpg"
            alt="404"
            width={800}
            height={500}
            className="rounded-xl h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="w-[400px] flex flex-col items-center">
          <h1 className="font-merriweather-sans text-secondary text-6xl">404</h1>
          <p className="text-gray-primary subtitle">La página que buscas no existe</p>
          <Link
            href="/"
            className={buttonVariants({ variant: 'default' })}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
