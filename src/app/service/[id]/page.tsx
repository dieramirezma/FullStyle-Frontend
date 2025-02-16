import ScheduleService from '@/components/schedule-service'
import React from 'react'

export default async function Page ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <ScheduleService id={id} />
  )
}
