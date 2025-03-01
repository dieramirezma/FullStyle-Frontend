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
import { ImageIcon, Loader2, X } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { toast } from 'sonner'
import { CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import axios from 'axios'

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
  }),
  photos: z.record(z.string().url()).optional()
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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [photos, setPhotos] = useState<Record<string, string>>({})
  const [photoCount, setPhotoCount] = useState(0)
  const [error, setError] = useState('')

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      description: '',
      service: '',
      price: '',
      duration: '',
      photos: {}
    }
  })

  async function handleImageUpload (e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen')
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await axios.post('/api/upload-media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        const photoKey = `photo${photoCount + 1}`
        const newPhotos = { ...photos, [photoKey]: response.data.url }
        setPhotos(newPhotos)
        setPhotoCount(prev => prev + 1)
        form.setValue('photos', newPhotos)
      } else {
        setError('Error al subir la imagen: ' + response.data.message)
      }
    } catch (err: any) {
      setError('Error al subir la imagen: ' + (err.message || 'Error desconocido'))
    } finally {
      setUploadingImage(false)
      // Limpiar el input para permitir subir la misma imagen nuevamente
      e.target.value = ''
    }
  }

  function removePhoto (key: string) {
    const newPhotos = Object.fromEntries(
      Object.entries(photos).filter(([k]) => k !== key)
    )
    setPhotos(newPhotos)
    form.setValue('photos', newPhotos)
  }

  async function onSubmit (values: z.infer<typeof serviceSchema>) {
    setLoading(true)
    try {
      await apiClient.post('detail', {
        site_id: siteId,
        service_id: values.service,
        description: values.description,
        price: values.price,
        duration: values.duration,
        photos: values.photos
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
      <DialogContent className="sm:max-w-[425px] max-h-full overflow-y-auto">
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
            <FormField
              name="photos"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">
                    Foto del servicio
                  </FormLabel>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(photos).map(([key, url]) => (
                        <div key={key} className="relative w-24 h-24 rounded-md overflow-hidden border">
                          <Image
                            src={url || '/placeholder.svg'}
                            alt={`Foto ${key}`}
                            fill
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => { removePhoto(key) }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <div className="w-24 h-24 flex items-center justify-center border border-dashed rounded-md">
                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                          {uploadingImage
                            ? (
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              )
                            : (
                            <>
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground mt-1">Subir foto</span>
                            </>
                              )}
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sube una foto de tu servicio para que los clientes puedan verlo
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(error.length > 0) && <p className="text-red-500 text-sm self-center">{error}</p>}
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
