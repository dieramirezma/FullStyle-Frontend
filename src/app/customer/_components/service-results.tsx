'use client'

import { useSearch } from '@/context/search-context'
import Link from 'next/link'
import ServiceCard from './service-card'
import { Loader2 } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

export function ServiceResults () {
  const { details, error, currentPage, totalPages, isLoading, handlePageChange } = useSearch()

  // Generar array de páginas a mostrar
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      let startPage = Math.max(1, currentPage - 2)
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      if (startPage > 1) {
        pages.push(1)
        if (startPage > 2) pages.push('ellipsis')
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error != null || details.length === 0) {
    return (
      <div className="text-center">
        <h2 className="font-bold text-primary-foreground">No se encontraron servicios con los filtros establecidos</h2>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {details.map((detail, index) => (
          <Link key={index} href={`/customer/service/${detail.service_id}?site_id=${detail.site_id}`}>
            <ServiceCard detail={detail} />
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => { onPageChange(currentPage - 1) }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) =>
              page === 'ellipsis'
                ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
                  )
                : (
                <PaginationItem key={`page-${page}`}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => { onPageChange(page as number) }}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
                  )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => { onPageChange(currentPage + 1) }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
