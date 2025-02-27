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
import { Link } from 'lucide-react'

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
    .max(50, { message: 'La descripción tiene un límite de 50 caracteres.' })
    .refine((val) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.?¿!¡)(\s]+$/.test(val), {
      message: 'La descripción solo puede contener letras y signos de puntuación.'
    }),
  services: z.array(z.number()).min(1, { message: 'Debe seleccionar mínimo un servicio' }),
  schedule: z.record(
    z.object({
      startTime: z.string(),
      endTime: z.string()
    })
  )
})

type WorkerFormValues = z.infer<typeof workerFormSchema>

export default function WorkerScheduleForm ({ className, urlCallback }: { className?: string, urlCallback?: string }) {

  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [siteId, setSiteId] = useState<number | null>(null)

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
      )
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
      )
    })
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
        services: data.services
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
        <CardTitle>Registro de Trabajador y Horario</CardTitle>
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
          </form>
        </Form>
      </CardContent>
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
    </Card>
  )
}
