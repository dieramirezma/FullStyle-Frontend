'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useState } from 'react'
import { EditServiceForm } from './edit-service-form'

interface Service {
  service_id: number
  site_id: number
  service_name: string
  price: number
  duration: number
}

interface ServiceListProps {
  services: Service[]
  onServiceClick: (serviceId: number) => void
  onServiceUpdate: (updatedService: Service) => void
}

export function ServiceList ({ services, onServiceClick, onServiceUpdate }: ServiceListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleEditClick = (service: Service, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingService(service)
    setIsDialogOpen(true)
  }

  const handleSave = (updatedService: Service) => {
    onServiceUpdate(updatedService)
    setIsDialogOpen(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 hover:cursor-pointer" onClick={() => { onServiceClick(service.service_id) }}>
              <div className="relative w-full aspect-video rounded-md overflow-hidden mb-2">
                <Image
                  src={'/images/services/afeitado.jpg'}
                  alt={service.service_name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className='flex justify-between items-end'>
                <div>
                  <h3 className="text-lg font-semibold">{service.service_name}</h3>
                  <p className="text-sm text-muted-foreground">Precio: ${service.price}</p>
                  <p className="text-sm text-muted-foreground">Duración: {service.duration} minutos</p>
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    className=""
                    onClick={(e) => { handleEditClick(service, e) }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar servicio</DialogTitle>
          </DialogHeader>
          {editingService && (
            <EditServiceForm
              service={editingService}
              onSave={handleSave}
              onCancel={() => { setIsDialogOpen(false) }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
