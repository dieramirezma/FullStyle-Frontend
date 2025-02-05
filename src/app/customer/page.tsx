import ServiceSearch from '@/components/service-search'
import { SearchResults } from '@/components/search-results'
import { SearchProvider } from '@/context/search-context'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Page () {
  return (
    <SearchProvider>
      <main className="flex flex-col gap-20 px-10 my-10 md:px-28">
        <section className="flex flex-col gap-10 w-full max-w-4xl mx-auto">
          <h1 className="title text-center">¿Qué deseas buscar hoy?</h1>
          <Tabs defaultValue="services" className="w-full">
            <TabsList className="grid w-full grid-cols-2 gap-4 h-auto mb-8 rounded-lg bg-inherit p-1">
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-primary data-[state=active]:font-bold data-[state=active]:text-secondary p-4 rounded-xl border border-muted transition-all hover:border-primary data-[state=active]:border-primary"
              >
                Servicios
              </TabsTrigger>
              <TabsTrigger
                value="sites"
                className="data-[state=active]:bg-primary data-[state=active]:font-bold data-[state=active]:text-secondary p-4 rounded-xl border border-muted transition-all hover:border-primary data-[state=active]:border-primary"
              >
                Sitios
              </TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="border rounded-2xl p-6 shadow-sm">
              <div className="w-full mb-4">
                <ServiceSearch />
              </div>
              <SearchResults />
            </TabsContent>
            <TabsContent value="sites" className="border rounded-2xl p-6 shadow-sm">
              <h2>Hola soy homero</h2>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </SearchProvider>
  )
}
