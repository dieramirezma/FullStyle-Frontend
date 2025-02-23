'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { format } from 'date-fns'
import { CalendarDays, Clock, User2, MapPin, Phone, Scissors } from 'lucide-react'
import type { Detail } from '@/app/customer/_components/site-search'
import type { Site } from './schedule-service'
import WidgetWompi from '@/components/widget-wompi';

interface AppointmentConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  selectedSlot: string
  serviceDetail: Detail
  workerName: string
  siteDetail: Site
  onConfirm: () => Promise<void>
}

export function AppointmentConfirmationDialog({
  isOpen,
  onClose,
  selectedSlot,
  serviceDetail,
  workerName,
  onConfirm,
  siteDetail
}: AppointmentConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Reserva</DialogTitle>
          <DialogDescription>Revisa los detalles de tu reserva antes de confirmar</DialogDescription>
        </DialogHeader>

        {/* Contenido con scroll */}
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
          <div className="rounded-lg border p-4">
            <div className="flex items-center gap-2 mb-2">
              <Scissors className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">{siteDetail.name}</h3>
            </div>
            <div className="space-y-2 pl-6">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{siteDetail.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{siteDetail.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <h3 className="font-semibold">{serviceDetail.service_name}</h3>
            <p className="text-sm text-muted-foreground">{serviceDetail.description || 'Sin descripción'}</p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(selectedSlot), 'EEEE, d MMMM yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(selectedSlot), 'HH:mm')} hrs</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User2 className="h-4 w-4 text-muted-foreground" />
                <span>{workerName}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Servicio</span>
              <span className="text-sm">${serviceDetail.price}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>Duración</span>
              <span>{serviceDetail.duration} minutos</span>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">${serviceDetail.price}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <WidgetWompi
              amount={Math.max(5000, serviceDetail.price * 0.1)}
              isOpen={isOpen}
              label="Pagar reserva"
              className="w-full"
            />
            <WidgetWompi
              amount={serviceDetail.price}
              isOpen={isOpen}
              label="Pagar completo"
              className="w-full"
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}
