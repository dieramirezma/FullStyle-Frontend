import WorkerScheduleForm from '@/components/WorkerScheduleForm'
import RegisterNavBar from '@/components/register-nav-bar'

export default function registerClientPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-center place-content-around px-10 py-10">
        <WorkerScheduleForm></WorkerScheduleForm>
      </div>
    </div>
  )
}
