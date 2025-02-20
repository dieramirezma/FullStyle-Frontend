'use client'

import apiClient from '@/utils/apiClient'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { ServiceList } from './_components/service-list'
import { AddServiceDialog } from './_components/add-service-dialog'
import { CATEGORIES } from '@/components/register-categories-form'

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

  const managerId = session?.user.id

  const fetchSiteAndDetails = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiClient.get(`site?manager_id=${managerId}`)
      const data: Site[] = response.data
      setSite(data[0])

      if (data[0]) {
        const [detailsResponse, servicesResponse] = await Promise.all([
          apiClient.get(`detail?site_id=${data[0].id}&limit=10`),
          apiClient.get('service') // Ajusta esta URL según tu API
        ])

        const detailsData: Detail[] = detailsResponse.data
        setDetails(detailsData)

        const servicesData = servicesResponse.data as Array<{ id: number, category_id: number, name: string }>
        setAvailableServices(servicesData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
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
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="title">Servicios</h1>
        <AddServiceDialog siteId={site.id} services={availableServices} onServiceAdded={fetchSiteAndDetails} />
      </div>
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
