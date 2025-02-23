import LoginForm from '@/components/login-form'
import RegisterNavBar from '@/components/register-nav-bar'
import Image from 'next/image'

export default function Page () {
  return (
    <div className="min-h-screen bg-background">
      <RegisterNavBar />
      <main className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="hidden lg:block lg:flex-1">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <Image src="/images/login.png" alt="Login" fill className="object-cover" priority />
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  )
}
