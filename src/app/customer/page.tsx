import ServiceSearch from '@/app/customer/_components/service-search'
import { ServiceResults } from './_components/service-results'
import { SearchProvider } from '@/context/search-context'

export default function Page () {
  return (
    <SearchProvider>
      <main className="flex flex-col gap-20 px-4 sm:px-10 my-10">
        <section className="flex flex-col gap-10 w-full max-w-4xl mx-auto">
          <h1 className="title text-center">¿Qué deseas buscar hoy?</h1>
          <div className="w-full mb-4">
            <ServiceSearch />
          </div>
          <ServiceResults />
        </section>
      </main>
    </SearchProvider>
  )
}
