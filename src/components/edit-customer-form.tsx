'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import apiClient from '@/utils/apiClient'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

const userSchema = z.object({
  names: z.string({
    required_error: 'El nombre es obligatorio'
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

export default function EditCustomerForm () {
  
  const { data: session, status } = useSession()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [loadingSession, setLoadingSession] = useState(true)

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      names: 'cargando...',
      email: 'cargando...',
      password: '',
      confirmPassword: ''
    }
  })

  useEffect(() => {
    if (session?.user) {
      form.setValue('names', session.user.name || '')
      form.setValue('email', session.user.email || '')
    }
  }, [session, form])

  async function onSubmit (values: z.infer<typeof userSchema>) {
    setError('')
    setLoading(true)

    const payload = {
      name: values.names,
      email: values.email,
      password: values.password
    }

    try {
      await apiClient.put(`user/${session?.user.id}`, payload)
      router.push('/login')
    } catch (error: any) {
      if (error.response?.data?.message) {
        setError(String(error.response.data.message))
      } else {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.')
      }
    } finally {
      setLoading(false)
    }
  }
  console.log(session?.user)
  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className="subtitle text-center">
          Edicion de cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='flex flex-col gap-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="names"
              control={form.control}
              disabled = {loadingSession}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Nombre</FormLabel>
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
              disabled = {loadingSession}
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Actualizando...' : 'ACTUALIZAR'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
