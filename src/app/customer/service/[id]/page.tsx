import SelectWorker from '@/components/select-worker'
import React from 'react'

export default async function Page ({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { id } = await params
  const { site_id: site } = await searchParams

  return (
    <SelectWorker id={id} site={site?.toString() ?? ''} />
  )
}
