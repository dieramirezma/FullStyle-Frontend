import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { MapPin, PhoneCall } from 'lucide-react'
import Image from 'next/image'
import { type Site } from './site-search'

// const images: Record<number, string> = {
//   1: '/images/services/cortes.jpg',
//   2: '/images/services/coloracion.jpg',
//   3: '/images/services/tratamientos-capilares.jpg',
//   4: '/images/services/peinados.jpg',
//   5: '/images/services/manicure.jpg',
//   6: '/images/services/tratamientos-faciales.jpg',
//   7: '/images/services/depilacion.jpg',
//   8: '/images/services/afeitado.jpg',
//   9: '/images/services/extensiones.jpg',
//   10: '/images/services/tratamientos-faciales.jpg'
// }

function SiteCard ({ site }: { site: Site }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={'/images/sites/site.jpg'}
          alt={'Barber shop'}
          fill
          sizes='(max-width: 768px) 100vw, 50vw'
          className="object-cover"
          priority
        />
      </div>
      <CardHeader>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{site.name}</h2>
          {/* <p className="text-2xl font-bold text-primary">
            {site.address}
          </p> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{site.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            <span className="text-sm">{site.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SiteCard
