'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const userSchema = z.object({
  names: z.string({
    required_error: 'El nombre es obligatorio'
  }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras'
  }),
  lastName: z.string({
    required_error: 'Los apellidos son obligatorios'
  }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras'
  }),
  email: z.string({
    required_error: 'El correo electrónico es obligatorio'
  }).email({
    message: 'Ingrese un correo válido'
  }),
  password: z.string({
    required_error: 'La contraseña es obligatoria'
  }).min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  confirmPassword: z.string({
    required_error: 'Debe confirmar la contraseña'
  })
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Las contraseñas no coinciden'
})

export default function RegisterCustomerForm () {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      names: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit (values: z.infer<typeof userSchema>) {
    setError('')
    setLoading(true)

    const payload = {
      name: `${values.names.trim()} ${values.lastName.trim()}`,
      email: values.email,
      password: values.password
    }

    try {
      await axios.post('http://localhost:5000/api/register', payload)
      router.push('/login')
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
    <Card className='w-2/6'>
      <CardHeader>
        <CardTitle className="subtitle2">
          Registro de Nuevo Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='flex flex-col gap-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="names"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Nombres</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Apellidos</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(error.length > 0) && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'REGISTRARSE'}
            </Button>            <Button variant='outline'>CONTINUAR CON GOOGLE</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
