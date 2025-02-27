'use client'

import React, { useState, useEffect } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Clock, Scissors, User, MapPin, Calendar, AlertTriangle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { type CalendarEvent } from './full-calendar'
import { format, differenceInHours } from 'date-fns'
import { es } from 'date-fns/locale'
import { useSession } from 'next-auth/react'
import apiClient from "@/utils/apiClient"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface DialogContentProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedEvent: CalendarEvent | null
  onCancelReservation?: (eventId: string) => Promise<void> | void
}

const DialogContentComponent: React.FC<DialogContentProps> = ({
  isOpen,
  setIsOpen,
  selectedEvent,
  onCancelReservation
}) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [canCancelDueToTime, setCanCancelDueToTime] = useState(true)
  const { data: session } = useSession()

  // Verificar si faltan más de 24 horas para la cita
  useEffect(() => {
    if (selectedEvent?.start) {
      const now = new Date()
      const hoursDifference = differenceInHours(selectedEvent.start, now)
      setCanCancelDueToTime(hoursDifference >= 24)
    }
  }, [selectedEvent])

  const handleCancelReservation = async () => {
    if (!selectedEvent?.id || !onCancelReservation) return

    setIsLoading(true)
    try {
      // función de cancelación
      await cancelAppointment();
      // email de cancelación
      await sendCancellationEmail();
      await onCancelReservation(selectedEvent.id)

      setIsOpen(false)
    } catch (error) {
      console.error('Error canceling reservation:', error)
    } finally {
      setIsLoading(false)
      setIsAlertOpen(false)
    }
  }

  const cancelAppointment = async () => {
    try {
      const response = await apiClient.delete(`appointment?id=${selectedEvent?.id}`)
      if (response.status !== 200) {
        throw new Error('Error al cancelar la cita.')
      }
    } catch (error) {
      console.error("Error fetching service detail:", error)
    }
  }

  const sendCancellationEmail = async () => {
    if (!selectedEvent || !session?.user.email) return;

    try {
      // Preparar los datos para el email
      const values = {
        customerName: session?.user?.name,
        customerEmail: session?.user?.email,
        siteName: selectedEvent.site?.name,
        siteAddress: selectedEvent.site?.address,
        sitePhone: selectedEvent.site?.phone,
        serviceName: selectedEvent.service?.name,
        workerName: selectedEvent.worker?.name,
        appointmentDate: format(selectedEvent.start, 'EEEE, d MMMM yyyy', { locale: es }),
        appointmentTime: format(selectedEvent.start, 'HH:mm')
      }

      // Enviar la solicitud al endpoint
      const responseEmail = await fetch('/api/send-email/appointment-canceled', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })

      if (!responseEmail.ok) {
        throw new Error('Error al enviar el mensaje de cancelación.')
      }

      return await responseEmail.json();
    } catch (error) {
      console.error('Error enviando email de cancelación:', error);
      throw error;
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!selectedEvent) return null

  const canCancel = selectedEvent?.status !== 'cancelled' && onCancelReservation && canCancelDueToTime

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md sm:max-w-lg max-h-screen overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl">{selectedEvent?.service?.name}</DialogTitle>
                <DialogDescription className="mt-1 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{formatDate(selectedEvent?.start)}</span>
                </DialogDescription>
              </div>
              {selectedEvent?.status && (
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(selectedEvent.status)}`}
                >
                  {selectedEvent.status === 'paid'
                    ? 'Pagado'
                    : selectedEvent.status === 'pending'
                      ? 'Pendiente'
                      : selectedEvent.status === 'cancelled'
                        ? 'Cancelado'
                        : selectedEvent.status}
                </span>
              )}
            </div>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Horario */}
            <Card className="overflow-hidden border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 bg-blue-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">Horario</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedEvent?.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                      {selectedEvent?.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Servicio */}
            {selectedEvent?.service && (
              <Card className="overflow-hidden border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 bg-purple-100 p-2 rounded-full">
                      <Scissors className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-purple-900">Servicio</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedEvent.service.description || 'No hay descripción disponible.'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-sm font-medium bg-purple-50 text-purple-700 px-2 py-1 rounded">
                          ${selectedEvent.service.price}
                        </span>
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded">
                          {selectedEvent.service.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profesional */}
            {selectedEvent?.worker && (
              <Card className="overflow-hidden border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 bg-green-100 p-2 rounded-full">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-green-900">Profesional</p>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedEvent.worker.profilePicture
                          ? (
                            <Avatar className="h-10 w-10 border-2 border-green-100">
                              <AvatarImage src={selectedEvent.worker.profilePicture} alt={selectedEvent.worker.name} />
                              <AvatarFallback className="bg-green-100 text-green-800">
                                {selectedEvent.worker.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )
                          : (
                            <Avatar className="h-10 w-10 bg-green-100">
                              <AvatarFallback className="text-green-800">
                                {selectedEvent.worker.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        <p className="text-sm font-medium">{selectedEvent.worker.name}</p>
                      </div>
                      {selectedEvent.worker.description && (
                        <p className="text-xs text-muted-foreground mt-2 bg-green-50 p-2 rounded">
                          {selectedEvent.worker.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ubicación */}
            {selectedEvent?.site && (
              <Card className="overflow-hidden border-l-4 border-l-amber-500">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 bg-amber-100 p-2 rounded-full">
                      <MapPin className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-amber-900">Ubicación</p>
                      <p className="text-sm font-medium">{selectedEvent.site.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{selectedEvent.site.address}</p>
                      {selectedEvent.site.phone && (
                        <p className="text-xs text-amber-600 mt-1 flex items-center">
                          <span className="inline-block w-4 h-4 mr-1">📞</span>
                          {selectedEvent.site.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            {onCancelReservation && selectedEvent?.status !== 'cancelled' && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="destructive"
                        onClick={() => { setIsAlertOpen(true) }}
                        disabled={isLoading || !canCancelDueToTime}
                        className="w-full sm:w-auto text-white"
                      >
                        Cancelar cita
                      </Button>
                    </div>
                  </TooltipTrigger>
                  {!canCancelDueToTime && (
                    <TooltipContent className="max-w-xs">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p>Las citas solo pueden cancelarse con al menos 24 horas de antelación.</p>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirmar cancelación
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Volver</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelReservation}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
            >
              {isLoading ? 'Cancelando...' : 'Sí, cancelar reserva'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default DialogContentComponent