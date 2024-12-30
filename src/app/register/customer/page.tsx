import Fullstyle from '@/components/icons/fullstyle'
import RegisterCustomerForm from '@/components/register-customer-form'
import RegisterNavBar from '@/components/register-nav-bar'

export default function registerClientPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-center place-content-around px-20">
        <Fullstyle />
        <RegisterCustomerForm></RegisterCustomerForm>
      </div>
    </div>
  )
}
