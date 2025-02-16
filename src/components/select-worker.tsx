'use client'
import React from 'react'
import SiteCard from '@/app/customer/_components/site-card'
import apiClient from '@/utils/apiClient'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export interface Worker {
  id: number
  name: string
  site_id: number
  profilepicture: string
  description: string
  active: boolean
}
export default function SelectWorker({ id, site }: { id: string; site: string }) {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`worker?site_id=${site}&service_id=${id}`)
        const data: Worker[] = response.data
        setWorkers(data)
        console.log(data)
      } catch (error) {
        console.error('Error al obtener datos:', error)
        setError('No se pudieron cargar los sitios.')
      }
    }
    if (site) {
      fetchData()
    }
  }, [site])

  return (
    <main className="flex flex-col gap-20 px-10 my-10 md:px-28">
        <section className="flex flex-col gap-10 w-full max-w-4xl mx-auto">
        <div className="w-full mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workers.map((worker, index) => (
              <Link key={index} href={`/service/${id}/${site.id}`}>
                <div>
                  {worker.name}
                  <div>
                    {worker.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        </section>
    </main>
  )
}
