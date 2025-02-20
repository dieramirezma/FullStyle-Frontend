'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export interface SalesData { name: string, ventas: number }

export function SalesChart ({ data }: { data: SalesData[] }) {
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
