'use client'

import apiClient from '@/utils/apiClient'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { ServiceList } from './_components/service-list'
import { AddServiceDialog } from './_components/add-service-dialog'
import { CATEGORIES } from '@/components/register-categories-form'
import axios from 'axios'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { ArrowRight, Building2, Plus, Scissors } from 'lucide-react'
import RegisterServiceForm from '@/components/register-services-form'
import LoadingSpinner from '@/components/loading-spinner'

interface Site {
  id: number
  name: string
  address: string
  phone: string
  manager_id: number
  photos: string
}

interface Detail {
  site_id: number
  site_name: string
  site_address: string
  category_id: number
  category_name: string
  service_id: number
  service_name: string
  price: number
  duration: number
  description: string | null
  photos: string | null
}

interface Service {
  service_id: number
  site_id: number
  service_name: string
  price: number
  duration: number
}

const fetchServices = async () => {
  const categories = CATEGORIES.map(category => category.id)
  try {
    const serviceRequests = categories.map(async categoryId =>
      await apiClient.get(`service?category_id=${categoryId}`)
    )

    const servicesByCategory = await Promise.all(serviceRequests)

    const allServices = servicesByCategory.flatMap(response => response.data)

    const servicesData = {
      available: allServices,
      selected: []
    }

    localStorage.setItem('servicesData', JSON.stringify(servicesData))

    return servicesData
  } catch (error) {
    console.error('Error fetching services:', error)
    return { available: [], selected: [] }
  }
}

function Page () {
  const { data: session, status } = useSession()
  const [site, setSite] = useState({ id: 0, name: '', address: '', phone: '' })
  const [details, setDetails] = useState<Detail[]>([])
  const [availableServices, setAvailableServices] = useState<Array<{ id: number, category_id: number, name: string }>>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ code: number, type: string } | null>(null)
  const [open, setOpen] = useState(false)
  const managerId = session?.user.id

  const fetchSiteAndDetails = useCallback(async () => {
    setLoading(true)
    try {
      console.log(`Fetching site for manager ID: ${managerId}`)
      const response = await apiClient.get(`site?manager_id=${managerId}`)
      const data: Site[] = response.data
      console.log('Site data:', data)
      setSite(data[0])

      try {
        if (data[0]) {
          const [detailsResponse, servicesResponse] = await Promise.all([
            apiClient.get(`detail?site_id=${data[0].id}&limit=10`),
            apiClient.get('service')
          ])

          const detailsData: Detail[] = detailsResponse.data
          setDetails(detailsData)

          const servicesData = servicesResponse.data as Array<{ id: number, category_id: number, name: string }>
          setAvailableServices(servicesData)
        }
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
  }, [managerId])

  useEffect(() => {
    const getServices = async () => {
      const servicesData = await fetchServices()
      setAvailableServices(servicesData.available)
    }
    getServices()
  }, [])

  useEffect(() => {
    if (status === 'authenticated' && managerId) {
      fetchSiteAndDetails()
    }
  }, [managerId, status, fetchSiteAndDetails])

  const handleServiceClick = (serviceId: number) => {
    console.log(`Service clicked: ${serviceId}`)
  }

  const handleServiceUpdate = async (updatedService: Service) => {
    try {
      await apiClient.put(
        `detail?site_id=${updatedService.site_id}&service_id=${updatedService.service_id}`,
        updatedService
      )
      setDetails((prevDetails) =>
        prevDetails.map((detail) =>
          detail.service_id === updatedService.service_id ? { ...detail, ...updatedService } : detail
        )
      )
    } catch (error) {
      console.error('Error updating service:', error)
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

  if (error?.code === 404 && error.type === 'services') {
    return (
      <div className="container mx-auto max-w-4xl">
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
                Crea servicios para comenzar a recibir reservas y gestionar tus empleados
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />
              <div className="bg-gray-50 rounded-lg text-left">
                <RegisterServiceForm
                  className="w-full"
                  urlCallback="/owner/employees"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className='flex flex-col justify-between w-full sm:flex-row sm:items-center'>
        <h1 className="title">Gestiona tus servicios</h1>
        <Button onClick={() => { setOpen(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar servicio
        </Button>
      </div>
      <AddServiceDialog
        siteId={site.id}
        services={availableServices}
        onServiceAdded={fetchSiteAndDetails}
        open={open}
        setOpen={setOpen}
      />
      <ServiceList
        services={details.map((detail) => ({
          service_id: detail.service_id,
          site_id: detail.site_id,
          service_name: detail.service_name,
          price: detail.price,
          duration: detail.duration
        }))}
        onServiceClick={handleServiceClick}
        onServiceUpdate={handleServiceUpdate}
      />
    </div>
  )
}

export default Page
