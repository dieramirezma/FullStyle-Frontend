'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'

const serviceSchema = z.object({
  description: z
    .string()
    .min(1, 'Escribe una descripción del servicio')
    .max(150, 'La descripción tiene un límite de 150 caracteres'),
  service: z.string().min(1, 'Selecciona un servicio'),
  price: z
    .string()
    .min(1, 'Indica el precio de tu servicio')
    .regex(/^[0-9]+$/, 'El precio del servicio solo debe contener números')
    .max(10, 'El precio puede tener máximo 10 dígitos'),
  duration: z
    .string()
    .min(1, 'La duración del servicio es obligatoria')
    .regex(/^[0-9]+$/, 'La duración del servicio solo debe contener números')
    .max(5, 'El límite de caracteres es de 5')
})

interface AddServiceDialogProps {
  siteId: number
  services: Array<{ id: number, category_id: number, name: string }>
  onServiceAdded: () => void
}

export function AddServiceDialog ({ siteId, services, onServiceAdded }: AddServiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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

      toast.success('Servicio agregado', {
        description: 'El servicio ha sido agregado exitosamente'
      })

      form.reset()
      setOpen(false)
      onServiceAdded()
    } catch (error: any) {
      toast.error('Error', {
        description: error.response?.data?.message || 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.'
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
          Agregar Servicio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
          <DialogDescription>Completa los detalles del servicio que deseas agregar</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servicio</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el servicio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={String(service.id)}>
                          {service.name}
                        </SelectItem>
                      ))}
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
                  <FormLabel>Descripción del servicio</FormLabel>
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
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
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
                  <FormLabel>Duración (minutos)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
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
