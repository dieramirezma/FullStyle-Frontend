import EditWorker from '@/components/edit-worker'
import Fullstyle from '@/components/icons/fullstyle'
import RegisterNavBar from '@/components/register-nav-bar'

export default function registerClientPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-center place-content-around px-20">
        <Fullstyle />
        <EditWorker></EditWorker>
      </div>
    </div>
  )
}
