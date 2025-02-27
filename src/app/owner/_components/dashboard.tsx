'use client'

import { ArrowRight, Building2, Calendar, DollarSign, Users } from 'lucide-react'
import { SalesChart } from './sales-chart'
import { BookingsChart } from './bookings-chart'
import { StatCard } from './stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import apiClient from '@/utils/apiClient'
import { ChartSkeleton } from './skeletons/chart-skeleton'
import { StatCardSkeleton } from './skeletons/stat-skeleton'
import { type SalesData } from './sales-chart'
import { type BookingsData } from './bookings-chart'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import axios from 'axios'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

interface SiteStatistics {
  site_id: number
  period: string
  count_periods: number
  statistics: Array<{
    year: number
    month: number
    total_amount: number
  }>
}

interface BookingStatistics {
  site_id: number
  period: string
  count_periods: number
  statistics: Array<{
    year: number
    month: number
    total: number
  }>
}

export function Dashboard () {
  const [siteId, setSiteId] = useState<number | null>(null)
  const [monthlyRevenue, setMonthlyRevenue] = useState<string | null>(null)
  const [revenueChange, setRevenueChange] = useState<{ text: string, color: string } | null>(null)
  const [monthlyBookings, setMonthlyBookings] = useState<string | null>(null)
  const [bookingsChange, setBookingsChange] = useState<{ text: string, color: string } | null>(null)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [bookingsData, setBookingsData] = useState<BookingsData[]>([])
  const [revenueLoading, setRevenueLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const { data: session } = useSession()

  useEffect(() => {
    const fetchSiteId = async () => {
      if (!session?.user?.is_manager) return // Validar si es un manager

      try {
        const response = await apiClient.get<Array<{ id: number }>>('site', {
          params: { manager_id: session.user.id }
        })

        if (response.data.length > 0) {
          setSiteId(response.data[0].id)
        } else {
          toast.error('No se encontró un negocio asociado a tu cuenta')
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          toast.error('No se encontró un negocio asociado a tu cuenta')
          setError('404')
        }
      }
    }

    fetchSiteId()
  }, [session]) // Se ejecuta cuando cambia la sesión

  useEffect(() => {
    if (!siteId) return // Esperamos a que siteId tenga valor

    const fetchMonthlyRevenue = async () => {
      try {
        const response = await apiClient.get<SiteStatistics>('payment/site_statistics', {
          params: { site_id: siteId, period: 'monthly' }
        })

        const stats = response.data.statistics
        const formattedData = stats.map(stat => {
          const monthName = new Date(stat.year, stat.month - 1).toLocaleString('es-ES', { month: 'short' })
          return { name: monthName.charAt(0).toUpperCase() + monthName.slice(1), ventas: stat.total_amount }
        })

        setSalesData(formattedData)

        if (stats.length >= 2) {
          const latest = stats[stats.length - 1].total_amount
          const previous = stats[stats.length - 2].total_amount
          const change = ((latest - previous) / previous) * 100

          setRevenueChange({
            text: `${change > 0 ? '+' : '-'} ${change.toFixed(1)}% respecto al mes anterior`,
            color: change > 0 ? 'text-green-500' : 'text-red-500'
          })

          setMonthlyRevenue(`$${latest.toLocaleString()}`)
        } else if (stats.length === 1) {
          setMonthlyRevenue(`$${stats[0].total_amount.toLocaleString()}`)
          setRevenueChange({ text: 'No hay datos del mes anterior', color: 'text-gray-500' })
        }
        setRevenueLoading(false)
      } catch (error) {
        console.error('Error fetching revenue:', error)
      }
    }

    const fetchMonthlyBookings = async () => {
      try {
        const response = await apiClient.get<BookingStatistics>('appointment/site_statistics', {
          params: { site_id: siteId, period: 'monthly' }
        })

        const stats = response.data.statistics
        const formattedData = stats.map(stat => {
          const monthName = new Date(stat.year, stat.month - 1).toLocaleString('es-ES', { month: 'short' })
          return { name: monthName.charAt(0).toUpperCase() + monthName.slice(1), Reservas: stat.total }
        })

        setBookingsData(formattedData)

        if (stats.length >= 2) {
          const latest = stats[stats.length - 1].total
          const previous = stats[stats.length - 2].total
          const change = ((latest - previous) / previous) * 100

          setBookingsChange({
            text: `${change.toFixed(1)}% ${change > 0 ? 'más' : 'menos'} respecto al mes anterior`,
            color: change > 0 ? 'text-green-500' : 'text-red-500'
          })

          setMonthlyBookings(`${latest}`)
        } else if (stats.length === 1) {
          setMonthlyBookings(`${stats[0].total}`)
          setBookingsChange({ text: 'No hay datos del mes anterior', color: 'text-gray-500' })
        }
        setBookingsLoading(false)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }

    fetchMonthlyRevenue()
    fetchMonthlyBookings()
  }, [siteId]) // Se ejecuta cuando `siteId` cambia

  if (error === '404') {
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
      <h1 className="text-3xl font-bold tracking-tight title">Resumen de tu negocio</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {revenueLoading
          ? (
          <StatCardSkeleton />
            )
          : (
          <StatCard
            title="Ingresos del mes"
            value={monthlyRevenue ?? '$0'}
            description={revenueChange}
            icon={DollarSign}
          />
            )}
        {bookingsLoading
          ? (
          <StatCardSkeleton />
            )
          : (
          <StatCard
            title="Reservas del mes"
            value={monthlyBookings ?? '0'}
            description={bookingsChange}
            icon={Calendar}
          />
            )}
        {bookingsLoading
          ? (
          <StatCardSkeleton />
            )
          : (
          <StatCard
            title="Nuevos clientes"
            value="0"
            description={{ text: 'Este mes', color: 'text-green-500' }}
            icon={Users}
          />
            )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {revenueLoading
          ? (
          <ChartSkeleton />
            )
          : (
          <Card>
            <CardHeader>
              <CardTitle>Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart data={salesData}/>
            </CardContent>
          </Card>
            )}
        {bookingsLoading
          ? (
          <ChartSkeleton />
            )
          : (
          <Card>
            <CardHeader>
              <CardTitle>Reservas</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingsChart data={bookingsData} />
            </CardContent>
          </Card>
            )}
      </div>
    </div>
  )
}
