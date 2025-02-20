'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Ene', Reservas: 24 },
  { name: 'Feb', Reservas: 18 },
  { name: 'Mar', Reservas: 22 },
  { name: 'Abr', Reservas: 27 },
  { name: 'May', Reservas: 34 },
  { name: 'Jun', Reservas: 32 },
  { name: 'Jul', Reservas: 38 }
]

export function BookingsChart () {
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
