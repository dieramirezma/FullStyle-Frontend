'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Detail } from '@/app/customer/_components/service-search'
import { type Site } from '@/app/customer/_components/site-search'

interface SearchContextType {
  details: Detail[]
  sites: Site[]
  setSites: (sites: Site[]) => void
  setDetails: (details: Detail[]) => void
  error: string | null
  setError: (error: string | null) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider ({ children }: { children: ReactNode }) {
  const [details, setDetails] = useState<Detail[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [error, setError] = useState<string | null>(null)

  // Cargar datos desde localStorage cuando el componente se monta
  useEffect(() => {
    const savedDetails = localStorage.getItem('searchDetails')
    const savedSites = localStorage.getItem('searchSites')
    if (savedDetails != null) {
      setDetails(JSON.parse(savedDetails) as Detail[])
    }
    if (savedSites != null) {
      setSites(JSON.parse(savedSites) as Site[])
    }
  }, [])

  // Guardar los detalles en localStorage cuando cambian
  useEffect(() => {
    if (details.length > 0) {
      localStorage.setItem('searchDetails', JSON.stringify(details))
    }
    if (sites.length > 0) {
      localStorage.setItem('searchSites', JSON.stringify(sites))
    }
  }, [details, sites])

  return (
    <SearchContext.Provider value={{ details, setDetails, sites, setSites, error, setError }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch () {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
