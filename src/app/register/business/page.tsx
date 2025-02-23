import RegisterBusinessForm from '@/components/register-business-form'
import RegisterNavBar from '@/components/register-nav-bar'

export default function registerClientPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex place-content-center pb-20 pt-10 px-10">
        <RegisterBusinessForm></RegisterBusinessForm>
      </div>
    </div>
  )
}
