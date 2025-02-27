'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'
import { CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const durationOptions = [
  { value: '30', label: '30 minutos' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1 hora y 30 minutos' },
  { value: '120', label: '2 horas' },
  { value: '150', label: '2 horas y 30 minutos' },
  { value: '180', label: '3 horas' }
]


const serviceSchema = z.object({
  description: z.string({
    required_error: 'Este campo es requerido'
  }).min(10, {
    message: 'La descripción debe tener al menos 10 caracteres'
  }).max(100, {
    message: 'La descripción tiene un limite de 100 caracteres'
  }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.?¿!¡)(\s]+$/, {
    message: 'La descripción solo puede contener letras y signos de puntuación'
  }),
  service: z.string({
    required_error: 'Selecciona un servicio'
  }).min(1, {
    message: 'Selecciona un servicio'
  }),
  price: z.string({
    required_error: 'Indica el precio de tu servicio'
  }).refine((val) => Number(val) > 1000, {
    message: 'El precio debe ser mayor a 1000 COP'
  }).refine((val) => Number(val) % 50 === 0, {
    message: 'El precio debe ser múltiplo de 50 COP'
  }),
  duration: z.enum(durationOptions.map(option => option.value) as [string, ...string[]], {
    message: 'Selecciona una duración'
  })
})

interface AddServiceDialogProps {
  siteId: number
  services: Array<{ id: number, category_id: number, name: string }>
  onServiceAdded: () => void
  open: boolean
  setOpen: (open: boolean) => void
}

export function AddServiceDialog ({ siteId, services, onServiceAdded, open, setOpen }: AddServiceDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      description: '',
      service: '',
      price: '',
      duration: ''
    }
  })

  async function onSubmit (values: z.infer<typeof serviceSchema>) {
    setLoading(true)
    try {
      await apiClient.post('detail', {
        site_id: siteId,
        service_id: values.service,
        description: values.description,
        price: values.price,
        duration: values.duration
      })

      toast({
        title: 'Servicio agregado',
        description: 'El servicio ha sido agregado exitosamente'
      })

      form.reset()
      setOpen(false)
      onServiceAdded()
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
          <DialogDescription>Completa los detalles del servicio que deseas agregar</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CardDescription className='text-xl text-black '>Datos del servicio</CardDescription>
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Servicio<span className="text-red-500"> *</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el servicio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        services.map((service) => (
                          <SelectItem key={ service.id } value={ String(service.id) }>
                            { service.name }
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">Descripcion del servicio<span className="text-red-500"> *</span></FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">Precio<span className="text-red-500"> *</span></FormLabel>
                  <FormControl>
                    <Input type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="duration"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">Duración<span className="text-red-500"> *</span></FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la duración" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" type="button" onClick={() => { setOpen(false) }}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Agregando...' : 'Agregar Servicio'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
