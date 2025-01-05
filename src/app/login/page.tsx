import Fullstyle from '@/components/icons/fullstyle'
import LoginForm from '@/components/login-form'
import RegisterNavBar from '@/components/register-nav-bar'

export default function Page () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-center place-content-around px-20 pt-28">
        <Fullstyle></Fullstyle>
        <LoginForm></LoginForm>
    </div>
    </div>
  )
}
