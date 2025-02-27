import RegisterServicesForm from '@/components/register-services-form'
import RegisterNavBar from '@/components/register-nav-bar'

export default function registerClientPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-center place-content-around px-20">
        <RegisterServicesForm></RegisterServicesForm>
      </div>
    </div>
  )
}
