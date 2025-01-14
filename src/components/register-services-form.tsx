'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'

const userSchema = z.object({
  description: z.string({
    required_error: 'Escribe una descripcion del servicio'
  }).min(1, {
    message: 'Escribe una descripcion del servicio'
  }).max(150, {
    message: 'La descripcion tiene un limite de 160 caracteres'
  }),
  service: z.string({
    required_error: 'Selecciona un servicio'
  }).min(1, {
    message: 'Selecciona un servicio'
  }),
  price: z.string({
    required_error: 'Indica el precio de tu servicio'
  }).min(1, {
    message: 'Indica el precio de tu servicio'
  }).regex(/^[0-9]+$/, {
    message: 'El precio del servicio solo debe contener numeros'
  }).max(10, {
    message: 'El precio puede tener maximo 10 digitos'
  }),
  duration: z.string({
    required_error: 'La duracion del servicio es obligatoria'
  }).min(1, {
    message: 'La duracion del servicio es obligatoria'
  }).regex(/^[0-9]+$/, {
    message: 'La duracion del servicio solo debe contener numeros'
  }).max(5, {
    message: 'El limite de caracteres es de 5'
  })
})

const fetchServices = async () => {
  const categoriesString = localStorage.getItem('categories')
  const categories = (categoriesString != null) ? categoriesString.split(',').map(Number) : []
  console.log(categoriesString)
  try {
    const serviceRequests = categories.map(async categoryId =>
      await axios.get(`http://127.0.0.1:5000/api/service?category_id=${categoryId}`)
    )

    const servicesByCategory = await Promise.all(serviceRequests)

    const allServices = servicesByCategory.flatMap(response => response.data)

    const servicesData = {
      available: allServices,
      selected: []
    }

    localStorage.setItem('servicesData', JSON.stringify(servicesData))

    console.log('Servicios guardados:', servicesData)
    return servicesData
  } catch (error) {
    console.error('Error fetching services:', error)
    return { available: [], selected: [] }
  }
}

fetchServices()
export default function RegisterServiceForm () {
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
  const [services, setServices] = useState<Array<{ id: number, category_id: number, name: string }>>([])

  useEffect(() => {
    const getServices = async () => {
      const servicesData = await fetchServices()
      setServices(servicesData.available)
    }
    getServices()
  }, [])

  async function onSubmit (values: z.infer<typeof userSchema>) {
    setError('')
    setLoading(true)
    const siteId = localStorage.getItem('siteId')
    const payload = {
      site_id: siteId,
      service_id: values.service,
      description: values.description,
      price: values.price,
      duration: values.duration
    }
    console.log(payload)
    try {
      await axios.post('http://localhost:5000/api/detail', payload)
    } catch (error: any) {
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
    <Card className='w-1/2'>
      <CardHeader>
        <CardTitle className="subtitle2 self-center">
          Registro de Nuevo Administrador
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CardDescription className='text-xl text-black '>Datos personales</CardDescription>
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Servicio</FormLabel>
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
                  <FormLabel className="font-black">Descripcion del servicio</FormLabel>
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
                  <FormLabel className="font-black">Precio</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel className="font-black">Duracion</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(error.length > 0) && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className='w-1/2 self-center' disabled={loading}>
              {loading ? 'Registrando...' : 'REGISTRARSE'}
            </Button>
          </form>

        </Form>
      </CardContent>
    </Card>
  )
}
