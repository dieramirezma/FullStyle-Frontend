import Fullstyle from '@/components/icons/fullstyle'
import RegisterNavBar from '@/components/register-nav-bar'
import TypeRegisterBox from '@/components/type-register-box'

export default function registerPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-center place-content-around px-20 py-20">
        <Fullstyle />
        <TypeRegisterBox />
      </div>
    </div>

  )
}