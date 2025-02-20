'use client'

import apiClient from '@/utils/apiClient'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ServiceList } from './_components/service-list'

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

function Page () {
  const { data: session, status } = useSession()
  const [site, setSite] = useState({ id: 0, name: '', address: '', phone: '' })
  const [details, setDetails] = useState<Detail[]>([])
  const [loading, setLoading] = useState(true)

  const managerId = session?.user.id

  useEffect(() => {
    if (status === 'authenticated' && managerId) {
      const fetchSiteAndDetails = async () => {
        setLoading(true)
        try {
          const response = await apiClient.get(`site?manager_id=${managerId}`)
          const data: Site[] = response.data
          setSite(data[0])

          if (data[0]) {
            const detailsResponse = await apiClient.get(`detail?site_id=${data[0].id}&limit=10`)
            const detailsData: Detail[] = detailsResponse.data

            setDetails(detailsData)
            console.log(detailsData)
          }
        } catch (error) {
          console.error('Error fetching site or details:', error)
        } finally {
          setLoading(false)
        }
      }

      fetchSiteAndDetails()
    }
  }, [managerId, status])

  if (loading) {
    return <div>Loading...</div>
  }
  const handleServiceClick = (serviceId: number) => {
    console.log(`Service clicked: ${serviceId}`)
  }

  const handleServiceUpdate = async (updatedService: Service) => {
    try {
      await apiClient.put(`detail?site_id=${updatedService.site_id}&service_id=${updatedService.service_id}`, updatedService)
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
      <h1 className="title mb-4">Services</h1>
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
