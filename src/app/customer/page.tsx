import ServiceSearch from '@/components/service-search'
import { SearchResults } from '@/components/search-results'
import { SearchProvider } from '@/context/search-context'

export default function Page () {
  return (
    <SearchProvider>
      <main className='flex flex-col gap-20 px-10 my-10 md:px-28'>
        <section className="flex flex-col gap-10 w-full">
          <h1 className="title text-center">¿Qué deseas buscar hoy?</h1>
          <div className="w-full">
            <ServiceSearch />
          </div>
          <SearchResults />
        </section>
      </main>
    </SearchProvider>
  )
}
