'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export interface BookingsData { name: string, Reservas: number }

export function BookingsChart ({ data }: { data: BookingsData[] }) {
  if (data.length === 0) {
    data = [
      { name: 'Enero', Reservas: 0 },
      { name: 'Febrero', Reservas: 0 },
      { name: 'Marzo', Reservas: 0 },
      { name: 'Abril', Reservas: 0 },
      { name: 'Mayo', Reservas: 0 },
      { name: 'Junio', Reservas: 0 },
      { name: 'Julio', Reservas: 0 },
      { name: 'Agosto', Reservas: 0 },
      { name: 'Septiembre', Reservas: 0 },
      { name: 'Octubre', Reservas: 0 },
      { name: 'Noviembre', Reservas: 0 },
      { name: 'Diciembre', Reservas: 0 }
    ]
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="Reservas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
