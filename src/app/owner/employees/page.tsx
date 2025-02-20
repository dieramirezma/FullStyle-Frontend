'use client'

import DeleteWorker from '@/components/delete-worker'
import { AddWorkerDialog } from './_components/add-worker-dialog'
import { useEffect, useState } from 'react'
import apiClient from '@/utils/apiClient'
import { useSession } from 'next-auth/react'

interface Service {
  service_id: number
  service_name: string
}

function Page () {
  const { data: session } = useSession()
  const [services, setServices] = useState<Service[]>([])
  const [siteId, setSiteId] = useState<number | null>(null)

  useEffect(() => {
    const fetchSiteAndServices = async () => {
      if (session?.user.id) {
        try {
          const siteResponse = await apiClient.get(`site?manager_id=${session.user.id}`)
          const site = siteResponse.data[0]
          setSiteId(site.id)

          const servicesResponse = await apiClient.get(`detail?site_id=${site.id}`)
          const servicesData = servicesResponse.data.map((detail: any) => ({
            service_id: detail.service_id,
            service_name: detail.service_name
          }))
          setServices(servicesData)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }
    }

    fetchSiteAndServices()
  }, [session?.user.id])

  const handleWorkerAdded = () => {
    // Refresh the workers list
    const deleteWorkerComponent = document.querySelector('delete-worker')
    if (deleteWorkerComponent) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      deleteWorkerComponent.refreshWorkers?.()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="title">Gestiona tus empleados</h1>
        {siteId && <AddWorkerDialog siteId={siteId} services={services} onWorkerAdded={handleWorkerAdded} />}
      </div>
      <DeleteWorker />
    </div>
  )
}

export default Page
