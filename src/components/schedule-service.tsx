'use client'
import SiteCard from '@/app/customer/_components/site-card'
import apiClient from '@/utils/apiClient'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export interface Site {
  id: number
  name: string
  address: string
  phone: string
  manager_id: number
}

export default function ScheduleService ({ id }: { id: string }) {
  const [sites, setSites] = useState<Site[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`site?service_id=${id}`)
        const allSites: Site[] = response.data

        const filteredSites = await Promise.all(
          allSites.map(async (site) => {
            try {
              const workersResponse = await apiClient.get(`worker?site_id=${site.id}&service_id=${id}`);
              const workers = workersResponse.data
              return workers.length > 0 ? site : null
            } catch (error) {
              return null
            }
          })
        )

        setSites(filteredSites.filter(Boolean))
      } catch (e) {
        setError('No se pudieron cargar los sitios.')
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  return (
    <main className="flex flex-col gap-20 px-10 my-10 md:px-28">
        <section className="flex flex-col gap-10 w-full max-w-4xl mx-auto">
        <div className="w-full mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((site, index) => (
              <Link key={index} href={`/service/${id}/${site.id}`}>
                <SiteCard site={site} />
              </Link>
            ))}
          </div>
        </div>
        </section>
    </main>
  )
}
