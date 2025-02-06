import Fullstyle from '@/components/icons/fullstyle'
import DeleteSite from '@/components/delete-bussines'
import RegisterNavBar from '@/components/register-nav-bar'

export default function registerClientPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-center place-content-around px-20">
        <Fullstyle />
        <DeleteSite></DeleteSite>
      </div>
    </div>
  )
}
