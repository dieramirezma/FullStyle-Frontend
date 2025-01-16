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
import { signIn, getSession } from "next-auth/react"

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

export default function RegisterCustomerForm() {
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

  async function onSubmit(values: z.infer<typeof userSchema>) {
    setError('')
    setLoading(true)

    const payload = {
      name: `${values.names.trim()} ${values.lastName.trim()}`,
      email: values.email,
      password: values.password
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}register`, payload)
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

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', {
        callbackUrl: '/',
        redirect: false,
      })

      if (result?.error) {
        setError('Error al autenticar con Google')
        return
      }

      const session = await getSession()

      if (!session?.user) {
        setError('No se pudo obtener la sesión del usuario')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}register_google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        setError(`Error en el backend: ${error.error}`)
        return
      }

    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      setError('Ocurrió un error al intentar iniciar sesión con Google')
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'REGISTRARSE'}
            </Button>
            <Button
              variant='outline'
              type="button"
              onClick={handleGoogleSignIn}
            >
              CONTINUAR CON GOOGLE
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}