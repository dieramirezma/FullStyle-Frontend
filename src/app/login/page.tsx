import LoginForm from '@/components/login-form'
import RegisterNavBar from '@/components/register-nav-bar'
import Image from 'next/image'

export default function Page () {
  return (
    <div className="min-h-screen bg-background">
      <RegisterNavBar />
      <main className="container mx-auto py-6 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <div className="overflow-hidden rounded-xl shadow-lg bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image Section - Visible on all screen sizes */}
              <div className="relative w-full hidden lg:block">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full w-full">
                  <Image src="/images/login.png" alt="Login" fill className="object-cover" priority />
                </div>
              </div>

              {/* Form Section */}
              <div className="p-6 sm:p-8 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
