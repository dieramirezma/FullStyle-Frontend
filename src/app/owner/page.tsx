import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react'
import { SalesChart } from './_components/sales-chart'
import { BookingsChart } from './_components/bookings-chart'
import { StatCard } from './_components/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page () {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight title">Resumen de tu negocio</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos del mes"
          value="$5,350,000"
          description="+20.1% respecto al mes anterior"
          icon={DollarSign}
        />
        <StatCard title="Reservas del mes" value="245" description="+180 completadas" icon={Calendar} />
        <StatCard
          title="Tasa de conversión"
          value="85%"
          description="+2.5% respecto al mes anterior"
          icon={TrendingUp}
        />
        <StatCard title="Nuevos clientes" value="38" description="Este mes" icon={Users} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingsChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
