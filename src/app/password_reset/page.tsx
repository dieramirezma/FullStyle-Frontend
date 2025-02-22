import RegisterNavBar from '@/components/register-nav-bar'
import ResetPassword from '@/components/reset-password'
import ResetPasswordRequest from '@/components/reset-password-request'
import Image from 'next/image'

export default async function Page ({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const resolvedParams = await searchParams

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
          {resolvedParams.token
            ? (
            <ResetPassword token={Array.isArray(resolvedParams.token) ? resolvedParams.token[0] : resolvedParams.token} />
              )
            : (
            <ResetPasswordRequest />
              )}
        </div>
      </div>
    </div>
  )
}
