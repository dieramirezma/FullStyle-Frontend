import Fullstyle from '@/components/icons/fullstyle'
import RegisterNavBar from '@/components/register-nav-bar'
import TypeRegisterBox from '@/components/type-register-box'

export default function registerPage () {
  return (
    <div>
      <RegisterNavBar />
      <main className="container mx-auto py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-around lg:gap-12">
          <div className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[400px]">
            <Fullstyle className="h-auto w-full" />
          </div>

          <div className="w-full max-w-md">
            <TypeRegisterBox />
          </div>
        </div>
      </main>
    </div>

  )
}
