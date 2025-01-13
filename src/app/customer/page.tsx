import ServiceSearch from '@/components/service-search'
import { SearchResults } from '@/components/search-results'
import { SearchProvider } from '@/context/search-context'

export default function Page () {
  return (
    <SearchProvider>
      <main className='flex flex-col gap-20 px-10 my-10 md:px-28'>
        <section className="flex flex-col items-center gap-10">
          <h1 className="title">¿Qué deseas buscar hoy?</h1>
          <ServiceSearch />
          <SearchResults />
        </section>
      </main>
    </SearchProvider>
  )
}
