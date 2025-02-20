'use client'

import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react'
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
  const [monthlyRevenue, setMonthlyRevenue] = useState<string | null>(null)
  const [revenueChange, setRevenueChange] = useState<{ text: string, color: string } | null>(null)
  const [monthlyBookings, setMonthlyBookings] = useState<string | null>(null)
  const [bookingsChange, setBookingsChange] = useState<{ text: string, color: string } | null>(null)
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [bookingsData, setBookingsData] = useState<BookingsData[]>([])

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const response = await apiClient.get<SiteStatistics>('payment/site_statistics', {
          params: {
            site_id: 2,
            period: 'monthly'
          }
        })
        const stats = response.data.statistics
        const formattedData = stats.map(stat => {
          const monthName = new Date(stat.year, stat.month - 1)
            .toLocaleString('es-ES', { month: 'short' })

          return {
            name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            ventas: stat.total_amount
          }
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
      } catch (error) {
        console.error('Error fetching revenue:', error)
      }
    }

    const fetchMonthlyBookings = async () => {
      try {
        const response = await apiClient.get<BookingStatistics>('appointment/site_statistics', {
          params: {
            site_id: 2,
            period: 'monthly'
          }
        })
        const stats = response.data.statistics
        const formattedData = stats.map(stat => {
          const monthName = new Date(stat.year, stat.month - 1)
            .toLocaleString('es-ES', { month: 'short' })

          return {
            name: monthName.charAt(0).toUpperCase() + monthName.slice(1),
            Reservas: stat.total
          }
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
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }

    fetchMonthlyRevenue()
    fetchMonthlyBookings()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight title">Resumen de tu negocio</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!monthlyRevenue
          ? (
          <StatCardSkeleton />
            )
          : (
          <StatCard
            title="Ingresos del mes"
            value={monthlyRevenue}
            description={revenueChange}
            icon={DollarSign}
          />
            )}
        {!monthlyBookings
          ? (
          <StatCardSkeleton />
            )
          : (
          <StatCard
            title="Reservas del mes"
            value={monthlyBookings}
            description={bookingsChange}
            icon={Calendar}
          />
            )}
        <StatCard
          title="Nuevos clientes"
          value="38"
          description={{ text: 'Este mes', color: 'text-green-500' }}
          icon={Users}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {salesData.length === 0
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
        {bookingsData.length === 0
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
