'use client'

import DeleteWorker from '@/components/delete-worker'
import { AddWorkerDialog } from './_components/add-worker-dialog'
import { useEffect, useState } from 'react'
import apiClient from '@/utils/apiClient'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { ArrowRight, Building2, Plus, Scissors } from 'lucide-react'
import LoadingSpinner from '@/components/loading-spinner'

interface Service {
  service_id: number
  service_name: string
}

function Page () {
  const { data: session } = useSession()
  const [services, setServices] = useState<Service[]>([])
  const [siteId, setSiteId] = useState<number | null>(null)
  const [error, setError] = useState<{ code: number, type: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [showButton, setShowButton] = useState(true)

  useEffect(() => {
    const fetchSiteAndServices = async () => {
      if (session?.user.id) {
        try {
          const siteResponse = await apiClient.get(`site?manager_id=${session.user.id}`)
          const site = siteResponse.data[0]
          setSiteId(site.id as number)

          try {
            const servicesResponse = await apiClient.get(`detail?site_id=${site.id}`)
            const servicesData: Service[] = servicesResponse.data.map((detail: any) => ({
              service_id: detail.service_id,
              service_name: detail.service_name
            }))
            setServices(servicesData)
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              setError({ code: 404, type: 'services' })
            }
          }
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 404) {
            setError({ code: 404, type: 'site' })
          }
        } finally {
          setLoading(false)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner
          size='xl'
        />
      </div>
    )
  }

  if (error?.code === 404 && error.type === 'services') {
    return (
      <div className="container mx-auto max-w-4xl w-full">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            {/* Top illustration */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Scissors className="h-12 w-12 text-primary" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 max-w-lg mx-auto text-center">
              <h1 className="title">
                No tienes ningún servicio creado
              </h1>

              <p className="text-gray-500 text-lg">
                Crea tu primer servicio para comenzar a recibir reservas y gestionar tus servicios
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />
              <Link
                href={'/owner/services'}
                className={buttonVariants({ variant: 'default' })}
              >
                Crear servicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error?.code === 404 && error.type === 'site') {
    return (
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            {/* Top illustration */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-primary" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 max-w-lg mx-auto text-center">
              <h1 className="title">
                No tienes ningún negocio creado
              </h1>

              <p className="text-gray-500 text-lg">
                Crea tu primer negocio para comenzar a recibir reservas y gestionar tus servicios
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />
              <Link
                href={'/owner/business'}
                className={buttonVariants({ variant: 'default' })}
              >
                Crear negocio
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className='flex flex-col justify-between w-full sm:flex-row sm:items-center'>
          <h1 className="title">Gestiona tus empleados</h1>
          { showButton && (
            <Button onClick={() => { setOpen(true) }}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Trabajador
            </Button>
          )}
        </div>
        {siteId && (
          <AddWorkerDialog
            siteId={siteId}
            services={services}
            onWorkerAdded={handleWorkerAdded}
            open={open}
            setOpen={setOpen}
          />
        )}
      </div>
      <DeleteWorker
        showButton={showButton}
        setShowButton={setShowButton}
      />
    </div>
  )
}

export default Page
