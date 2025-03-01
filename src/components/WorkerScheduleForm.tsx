'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { TimeRangeInput } from '@/components/TimeRangeInput'
import apiClient from '@/utils/apiClient'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ImageIcon, Loader2, X } from 'lucide-react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

interface Service {
  service_id: number
  service_name: string
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Definimos el esquema de validación con Zod
const workerFormSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'El nombre debe tener al menos 5 caracteres.' })
    .max(50, { message: 'El nombre no puede tener más de 50 caracteres.' })
    .refine((val) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), {
      message: 'El nombre solo puede contener letras y espacios.'
    }),
  description: z
    .string()
    .min(10, { message: 'La descripción debe tener al menos 10 caracteres.' })
    .max(100, { message: 'La descripción tiene un límite de 100 caracteres.' }),
  services: z.array(z.number()).min(1, { message: 'Debe seleccionar mínimo un servicio' }),
  schedule: z.record(
    z.object({
      startTime: z.string(),
      endTime: z.string()
    })
  ),
  profilepicture: z.string().optional()
})

type WorkerFormValues = z.infer<typeof workerFormSchema>

export default function WorkerScheduleForm ({ className, urlCallback }: { className?: string, urlCallback?: string }) {
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [siteId, setSiteId] = useState<number | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [photos, setPhotos] = useState<string>('')
  const [error, setError] = useState('')

  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    const fetchSiteAndServices = async () => {
      if (session?.user.id) {
        try {
          const siteResponse = await apiClient.get(`site?manager_id=${session.user.id}`)
          const site = siteResponse.data[0]
          setSiteId(site.id as number)

          try {
            const servicesResponse = await apiClient.get(`detail?site_id=${site.id}`)
            const servicesData: Service[] = servicesResponse.data.map((detail: any) => ({
              service_id: detail.service_id,
              service_name: detail.service_name
            }))
            setServices(servicesData)
          } catch (error) {
            console.log(error)
          }
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchSiteAndServices()
  }, [session?.user.id])

  // Inicializamos el formulario con React Hook Form y Zod
  const form = useForm<WorkerFormValues>({
    resolver: zodResolver(workerFormSchema),
    defaultValues: {
      name: '',
      description: '',
      services: [],
      schedule: DAYS.reduce(
        (acc, day) => ({
          ...acc,
          [day]: { startTime: '10:00', endTime: '19:00' }
        }),
        {}
      ),
      profilepicture: ''
    }
  })

  const resetForm = () => {
    form.reset({
      name: '',
      description: '',
      services: [],
      schedule: DAYS.reduce(
        (acc, day) => ({
          ...acc,
          [day]: { startTime: '10:00', endTime: '19:00' }
        }),
        {}
      ),
      profilepicture: ''
    })
  }

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

      const url: string = response.data.url
      if (response.data.success) {
        setPhotos(url)
        form.setValue('profilepicture', url)
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

  function removePhoto () {
    setPhotos('')
    form.setValue('profilepicture', '')
  }

  const handleTimeChange = (day: string, startTime: string, endTime: string) => {
    const currentSchedule = form.getValues('schedule')
    form.setValue(
      'schedule',
      {
        ...currentSchedule,
        [day]: { startTime, endTime }
      },
      { shouldValidate: true }
    )
  }

  const onSubmit = async (data: WorkerFormValues) => {
    setLoading(true)

    try {
      // Validación adicional para las horas
      for (const day of DAYS) {
        const { startTime, endTime } = data.schedule[day]
        if (startTime.length > 0 && endTime.length > 0 && startTime >= endTime) {
          throw new Error(`Para ${day}, la hora de fin debe ser posterior a la hora de inicio.`)
        }
      }

      // Crear trabajador
      const workerResponse = await apiClient.post('worker', {
        name: data.name,
        site_id: siteId,
        description: data.description,
        services: data.services,
        profilepicture: photos
      })

      const workerId = workerResponse.data.id

      // Asignar servicios
      await Promise.all(
        data.services.map(
          async (serviceId) =>
            await apiClient.post('worker_has_service', {
              worker_id: workerId,
              service_id: serviceId
            })
        )
      )

      // Asignar horarios
      await Promise.all(
        Object.entries(data.schedule).map(
          async ([day, time]) =>
            await apiClient.post('availability', {
              worker_id: workerId,
              weekday: day,
              starttime: time.startTime,
              endtime: time.endTime
            })
        )
      )

      if (urlCallback) {
        router.push(urlCallback)
      }

      toast.success('Éxito', {
        description: 'Trabajador agregado correctamente'
      })

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
    <Card className={className ?? 'w-full max-w-2xl mx-auto'}>
      <CardHeader>
        <CardTitle className="subtitle text-center">
          Registro de Trabajador y Horario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del trabajador<span className="text-red-500"> *</span></FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción<span className="text-red-500"> *</span></FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label>Horario de trabajo<span className="text-red-500"> *</span></Label>
              {DAYS.map((day) => (
                <TimeRangeInput
                  key={day}
                  day={day}
                  startTime={form.getValues().schedule[day]?.startTime || '10:00'}
                  endTime={form.getValues().schedule[day]?.endTime || '19:00'}
                  onChange={handleTimeChange}
                />
              ))}
            </div>

            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Servicios que realizará<span className="text-red-500"> *</span></FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {services.map((service) => (
                      <FormField
                        key={service.service_id}
                        control={form.control}
                        name="services"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={service.service_id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(service.service_id)}
                                  onCheckedChange={(checked) => {
                                    checked
                                      ? field.onChange([...field.value, service.service_id])
                                      : field.onChange(field.value?.filter((value) => value !== service.service_id))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{service.service_name}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="profilepicture"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">
                    Foto del trabajador
                  </FormLabel>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4">
                        {photos && (
                          <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                            <Image
                              src={photos || '/placeholder.svg'}
                              alt={'Foto perfil'}
                              fill
                              className="object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-1 right-1 h-6 w-6"
                              onClick={() => { removePhoto() }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

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
                      Sube una foto de tu trabajador para que los clientes lo reconozcan
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(error.length > 0) && <p className="text-red-500 text-sm self-center">{error}</p>}
      <CardFooter className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? 'Agregando...' : 'AGREGAR TRABAJADOR'}
        </Button>
        {!urlCallback && (
          <Button variant="outline" className="w-full sm:w-auto">
            <Link href="/login" className="w-full">
              Finalizar registro
            </Link>
          </Button>
        )}
      </CardFooter>
        </form>
      </Form>
    </CardContent>
    </Card>
  )
}
