'use client'

import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from 'react'
import type { Detail } from '@/app/customer/_components/service-search'
import type { Site } from '@/app/customer/_components/site-search'
import apiClient from '@/utils/apiClient'

interface SearchContextType {
  details: Detail[]
  sites: Site[]
  setSites: (sites: Site[]) => void
  error: string | null
  currentPage: number
  totalPages: number
  pageSize: number
  isLoading: boolean
  currentFilters: any
  fetchServices: (page?: number, filters?: any) => Promise<void>
  handlePageChange: (page: number) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

const PAGE_SIZE = 9

export function SearchProvider ({ children }: { children: ReactNode }) {
  const [allData, setAllData] = useState<Detail[]>([])
  const [details, setDetails] = useState<Detail[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [currentFilters, setCurrentFilters] = useState({})
  const [isInitialized, setIsInitialized] = useState(false)

  const updatePaginatedData = useCallback((data: Detail[], page: number) => {
    const total = Math.ceil(data.length / PAGE_SIZE)
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE

    setAllData(data)
    setDetails(data.slice(start, end))
    setTotalPages(total)
    setCurrentPage(page)
  }, [])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const start = (page - 1) * PAGE_SIZE
      const end = start + PAGE_SIZE
      setDetails(allData.slice(start, end))
      setCurrentPage(page)
    }
  }

  const fetchServices = useCallback(
    async (page = 1, filters = {}) => {
      setIsLoading(true)
      try {
        const response = await apiClient.get<Detail[]>('detail', { params: filters })
        const data = response.data
        setCurrentFilters(filters)
        updatePaginatedData(data, page)
        setError(null)

        // Actualizar localStorage
        localStorage.setItem('allDetails', JSON.stringify(data))
      } catch (error: any) {
        setError(error.response?.data?.message as string || 'Error al cargar los servicios')
        updatePaginatedData([], 1)
      } finally {
        setIsLoading(false)
      }
    },
    [updatePaginatedData]
  )

  // Inicialización - solo se ejecuta una vez
  useEffect(() => {
    if (!isInitialized) {
      const savedDetails = localStorage.getItem('allDetails')
      const savedSites = localStorage.getItem('searchSites')

      if (savedDetails) {
        const data = JSON.parse(savedDetails)
        updatePaginatedData(data, 1)
      } else {
        fetchServices(1, {})
      }

      if (savedSites) {
        setSites(JSON.parse(savedSites))
      }

      setIsInitialized(true)
    }
  }, [isInitialized, fetchServices, updatePaginatedData])

  // Guardar sites en localStorage
  useEffect(() => {
    if (sites.length > 0) {
      localStorage.setItem('searchSites', JSON.stringify(sites))
    }
  }, [sites])

  const value = {
    details,
    sites,
    setSites,
    error,
    currentPage,
    totalPages,
    pageSize: PAGE_SIZE,
    isLoading,
    currentFilters,
    fetchServices,
    handlePageChange
  }

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearch () {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
