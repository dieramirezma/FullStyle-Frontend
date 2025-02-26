'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import Link from 'next/link'
import { CATEGORIES } from './register-categories-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const durationOptions = [
  { value: '30', label: '30 minutos' },
  { value: '60', label: '1 hora' },
  { value: '90', label: '1 hora y 30 minutos' },
  { value: '120', label: '2 horas' },
  { value: '150', label: '2 horas y 30 minutos' },
  { value: '180', label: '3 horas' }
]

const userSchema = z.object({
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

const fetchServices = async () => {
  const categories = CATEGORIES.map(category => category.id)
  try {
    const serviceRequests = categories.map(async categoryId =>
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}service?category_id=${categoryId}`)
    )

    const servicesByCategory = await Promise.all(serviceRequests)

    const allServices = servicesByCategory.flatMap(response => response.data)

    const servicesData = {
      available: allServices,
      selected: []
    }

    localStorage.setItem('servicesData', JSON.stringify(servicesData))

    return servicesData
  } catch (error) {
    console.error('Error fetching services:', error)
    return { available: [], selected: [] }
  }
}

fetchServices()
export default function RegisterServiceForm ({ className, urlCallback }: { className?: string, urlCallback?: string }) {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      description: '',
      price: '',
      duration: ''
    }
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [services, setServices] = useState<Array<{ id: number, category_id: number, name: string }>>([])

  const router = useRouter()

  useEffect(() => {
    const getServices = async () => {
      const servicesData = await fetchServices()
      setServices(servicesData.available)
    }
    getServices()
  }, [])

  async function onSubmit (values: z.infer<typeof userSchema>) {
    setError('')
    setSuccessMessage('')
    setLoading(true)
    const siteId = localStorage.getItem('siteId')
    const payload = {
      site_id: siteId,
      service_id: values.service,
      description: values.description,
      price: values.price,
      duration: values.duration
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}detail`, payload)
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== Number(values.service))
      )
      form.setValue('service', '')
      toast.success('Servicio agregado de forma exitosa')
      if (urlCallback) {
        router.push(urlCallback)
      }
    } catch (error: any) {
      setSuccessMessage('')
      if (error.response.data.message !== undefined) {
        setError(String(error.response.data.message))
      } else {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.')
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card className={className ?? 'w-full md:w-1/2'}>
      <CardHeader>
        <CardTitle className="subtitle text-center">
          Registro de Nuevo Servicio
        </CardTitle>
      </CardHeader>
      <CardContent>
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
            {(successMessage.length > 0) && !loading && (
              <p className="text-green-500 text-sm self-center">{successMessage}</p>
            )}
            {(error.length > 0) && <p className="text-red-500 text-sm self-center">{error}</p>}
            <CardFooter className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button type="submit" className='w-full sm:w-auto' disabled={loading}>
                {loading ? 'Agregando...' : 'AGREGAR UN NUEVO SERVICIO'}
              </Button>
              {!urlCallback && (
                <Button variant='outline' className='w-full sm:w-auto'>
                  <Link href={'/register/worker'}>Continuar con el registro </Link>
                </Button>
              )}
            </CardFooter>
          </form>

        </Form>
      </CardContent>
    </Card>
  )
}
