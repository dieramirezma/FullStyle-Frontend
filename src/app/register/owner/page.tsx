import RegisterNavBar from '@/components/register-nav-bar'
import RegisterOwnerForm from '@/components/register-owner-form'

export default function registerClientPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-center place-content-around px-10 my-3">
        <RegisterOwnerForm></RegisterOwnerForm>
      </div>
    </div>
  )
}
