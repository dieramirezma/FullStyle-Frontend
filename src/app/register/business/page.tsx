import RegisterBusinessForm from '@/components/register-business-form'
import RegisterNavBar from '@/components/register-nav-bar'

export default function registerClientPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex place-content-center py-20 px-20">
        <RegisterBusinessForm></RegisterBusinessForm>
      </div>
    </div>
  )
}
