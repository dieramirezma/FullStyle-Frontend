'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { type Detail } from '@/components/service-search'

interface SearchContextType {
  details: Detail[]
  setDetails: (details: Detail[]) => void
  error: string | null
  setError: (error: string | null) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider ({ children }: { children: ReactNode }) {
  const [details, setDetails] = useState<Detail[]>([])
  const [error, setError] = useState<string | null>(null)

  // Cargar datos desde localStorage cuando el componente se monta
  useEffect(() => {
    const savedDetails = localStorage.getItem('searchDetails')
    if (savedDetails != null) {
      setDetails(JSON.parse(savedDetails) as Detail[])
    }
  }, [])

  // Guardar los detalles en localStorage cuando cambian
  useEffect(() => {
    if (details.length > 0) {
      localStorage.setItem('searchDetails', JSON.stringify(details))
    }
  }, [details])

  return (
    <SearchContext.Provider value={{ details, setDetails, error, setError }}>
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
