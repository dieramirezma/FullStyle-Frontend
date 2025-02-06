'use client'

import { useSearch } from '@/context/search-context'
import Link from 'next/link'
import SiteCard from './site-card'

export function SiteResults () {
  const { sites, error } = useSearch()

  if (error != null || sites.length === 0) {
    return (
      <div className="text-center">
        <h2 className='font-bold text-primary-foreground'>
          No se encontraron sitios con los filtros establecidos
        </h2>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sites.map((site, index) => (
        <Link key={index} href={`/service/${site.id}`}>
          <SiteCard site={site} />
        </Link>
      ))}
    </div>
  )
}
