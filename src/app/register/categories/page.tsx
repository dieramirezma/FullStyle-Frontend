import RegisterCategoriesForm from '@/components/register-categories-form'
import RegisterNavBar from '@/components/register-nav-bar'

export default function registerClientPage () {
  return (
    <div>
      <RegisterNavBar />
      <div className="h-full flex items-center place-content-around p-10">
        <RegisterCategoriesForm></RegisterCategoriesForm>
      </div>
    </div>
  )
}
