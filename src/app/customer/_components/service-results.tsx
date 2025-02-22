'use client'

import { useSearch } from '@/context/search-context'
import Link from 'next/link'
import ServiceCard from './service-card'

export function ServiceResults () {
  const { details, error } = useSearch()

  if (error != null || details.length === 0) {
    return (
      <div className="text-center">
        <h2 className='font-bold text-primary-foreground'>
          No se encontraron servicios con los filtros establecidos
        </h2>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {details.map((detail, index) => (
        <Link key={index} href={`/customer/service/${detail.service_id}?site_id=${detail.site_id}`}>
          <ServiceCard detail={detail} />
        </Link>
      ))}
    </div>
  )
}
