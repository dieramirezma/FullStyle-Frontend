'use client'

import React, { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { TimeRangeInput } from '@/components/TimeRangeInput'
import apiClient from '@/utils/apiClient'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

type Schedule = Record<string, { startTime: string, endTime: string }>

interface Service {
  service_id: number
  service_name: string
}

interface WorkerData {
  name: string
  description: string
  schedule: Schedule
}

interface AddWorkerDialogProps {
  siteId: number
  services: Service[]
  onWorkerAdded: () => void
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function AddWorkerDialog ({ siteId, services, onWorkerAdded }: AddWorkerDialogProps) {
  const [open, setOpen] = useState(false)
  const [workerData, setWorkerData] = useState<WorkerData>({
    name: '',
    description: '',
    schedule: DAYS.reduce(
      (acc, day) => ({
        ...acc,
        [day]: { startTime: '10:00', endTime: '19:00' }
      }),
      {}
    )
  })
  const [loading, setLoading] = useState(false)
  const [selectedServices, setSelectedServices] = useState<number[]>([])

  const handleServiceChange = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWorkerData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTimeChange = (day: string, startTime: string, endTime: string) => {
    setWorkerData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { startTime, endTime }
      }
    }))
  }

  const resetForm = () => {
    setWorkerData({
      name: '',
      description: '',
      schedule: DAYS.reduce(
        (acc, day) => ({
          ...acc,
          [day]: { startTime: '10:00', endTime: '19:00' }
        }),
        {}
      )
    })
    setSelectedServices([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones
      if (workerData.name.trim().length === 0) {
        throw new Error('El nombre del trabajador es requerido.')
      }

      for (const day of DAYS) {
        const { startTime, endTime } = workerData.schedule[day]
        if (startTime.length > 0 && endTime.length > 0 && startTime >= endTime) {
          throw new Error(`Para ${day}, la hora de fin debe ser posterior a la hora de inicio.`)
        }
      }

      if (selectedServices.length < 1) {
        throw new Error('Debe seleccionar mínimo un servicio')
      }

      // Crear trabajador
      const workerResponse = await apiClient.post('worker', {
        name: workerData.name,
        site_id: siteId,
        description: workerData.description,
        services: selectedServices
      })

      const workerId = workerResponse.data.id

      // Asignar servicios
      await Promise.all(
        selectedServices.map(async (serviceId) =>
          await apiClient.post('worker_has_service', {
            worker_id: workerId,
            service_id: serviceId
          })
        )
      )

      // Asignar horarios
      await Promise.all(
        Object.entries(workerData.schedule).map(async ([day, time]) =>
          await apiClient.post('availability', {
            worker_id: workerId,
            weekday: day,
            starttime: time.startTime,
            endtime: time.endTime
          })
        )
      )

      toast.success('Éxito', {
        description: 'Trabajador agregado correctamente'
      })

      onWorkerAdded()
      setOpen(false)
      resetForm()
    } catch (error: any) {
      toast.error('Error', {
        description: error.response?.data?.message || error.message || 'Ocurrió un error inesperado'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Trabajador
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Trabajador</DialogTitle>
          <DialogDescription>Ingresa los datos del nuevo trabajador y su horario</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del trabajador</Label>
            <Input id="name" name="name" value={workerData.name} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              name="description"
              value={workerData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Horario de trabajo</Label>
            {DAYS.map((day) => (
              <TimeRangeInput
                key={day}
                day={day}
                startTime={workerData.schedule[day].startTime}
                endTime={workerData.schedule[day].endTime}
                onChange={handleTimeChange}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Label>Servicios que realizará</Label>
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <div key={service.service_id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`service-${service.service_id}`}
                    checked={selectedServices.includes(service.service_id)}
                    onChange={() => { handleServiceChange(service.service_id) }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`service-${service.service_id}`} className="font-normal">
                    {service.service_name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <Button variant="outline" type="button" onClick={() => { setOpen(false) }}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Agregando...' : 'Agregar Trabajador'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
