import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Building, Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import { type Detail } from './site-search'

function approximateMinutesToHours (minutes: number) {
  const durationOptions = [
    { value: '30', label: '30 minutos' },
    { value: '60', label: '1 hora' },
    { value: '90', label: '1 hora y 30 minutos' },
    { value: '120', label: '2 horas' },
    { value: '150', label: '2 horas y 30 minutos' },
    { value: '180', label: '3 horas' }
  ]

  return durationOptions.reduce((closest, option) => {
    const optionValue = parseInt(option.value, 10)
    return Math.abs(optionValue - minutes) < Math.abs(parseInt(closest.value, 10) - minutes)
      ? option
      : closest
  }, durationOptions[0])
}

function ServiceCard ({ detail }: { detail: Detail }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={detail?.photos?.photo1 ?? '/images/services/default.webp'}
          alt={detail?.description ?? 'Imagen del servicio'}
          fill
          sizes='(max-width: 768px) 100vw, 50vw'
          className="object-cover"
          priority
        />
      </div>
      <CardHeader>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{detail.description}</h2>
          <p className="text-2xl font-bold text-primary">
            ${detail.price}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span className="text-sm">{detail.site_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{detail.site_address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{approximateMinutesToHours(detail.duration).label}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceCard
