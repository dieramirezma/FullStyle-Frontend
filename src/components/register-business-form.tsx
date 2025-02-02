'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const businessTypes = ['Barberia', 'Peluqueria', 'Salon de estetica']

const userSchema = z.object({
  name: z.string({
    required_error: 'El nombre es obligatorio'
  }).min(1, {
    message: 'El nombre es obligatorio'
  }),
  address: z.string({
    required_error: 'La direccion es obligatoria'
  }).min(1, {
    message: 'El nombre es obligatorio'
  }),
  phone: z.string({
    required_error: 'El numero telefonico es obligatorio'
  }).min(1, {
    message: 'El nombre es obligatorio'
  }).regex(/^[0-9]+$/, {
    message: 'El numero telefonico solo puede contener numeros'
  }),
  businessType: z.enum(['Barberia', 'Peluqueria', 'Salon de estetica'], {
    message: 'Seleccione el tipo de negocio'
  })
})

export default function RegisterBusinessForm () {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: ''
    }
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit (values: z.infer<typeof userSchema>) {
    setError('')
    setLoading(true)
    const id = 2
    const payload = {
      name: values.name.trim(),
      address: values.address,
      phone: values.phone,
      manager_id: id
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}site`, payload)
      localStorage.setItem('siteId', String(response.data.id))
      router.push('/register/categories')
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

  console.log(form.formState.errors)

  return (
    <Card className='w-2/6'>
      <CardHeader>
        <CardTitle className="subtitle">
          Registro del Negocio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='flex flex-col gap-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Nombre del negocio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Direccion del negocio</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Numero telefonico</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Tipo de negocio</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de cuenta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        businessTypes.map((type) => (
                          <SelectItem key={ type } value={ type }>
                            { type }
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              />
            {(error.length > 0) && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'REGISTRARSE'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
