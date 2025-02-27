'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export interface BookingsData { name: string, Reservas: number }

export function BookingsChart ({ data }: { data: BookingsData[] }) {
  if (data.length === 0) {
    data = [
      { name: 'Enero', Reservas: 0 },
      { name: 'Febrero', Reservas: 0 }
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
