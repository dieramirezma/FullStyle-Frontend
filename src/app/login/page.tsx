import LoginForm from '@/components/login-form'
import RegisterNavBar from '@/components/register-nav-bar'
import Image from 'next/image'

export default function Page () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-stretch justify-center px-20 py-8 gap-8">
        <div className="flex-1 max-w-[50%] flex items-center">
          <Image
            src="/images/login.png"
            alt="Login"
            width={800}
            height={500}
            className="rounded-xl h-full object-cover"
          />
        </div>

        <div className="w-[400px] flex items-center">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
