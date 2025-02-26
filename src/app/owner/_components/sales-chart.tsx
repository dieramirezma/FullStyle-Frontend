'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export interface SalesData { name: string, ventas: number }

export function SalesChart ({ data }: { data: SalesData[] }) {
  if (data.length === 0) {
    data = [
      { name: 'Enero', ventas: 0 },
      { name: 'Febrero', ventas: 0 },
      { name: 'Marzo', ventas: 0 },
      { name: 'Abril', ventas: 0 },
      { name: 'Mayo', ventas: 0 },
      { name: 'Junio', ventas: 0 },
      { name: 'Julio', ventas: 0 },
      { name: 'Agosto', ventas: 0 },
      { name: 'Septiembre', ventas: 0 },
      { name: 'Octubre', ventas: 0 },
      { name: 'Noviembre', ventas: 0 },
      { name: 'Diciembre', ventas: 0 }
    ]
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="ventas" stroke="hsl(var(--primary))" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
