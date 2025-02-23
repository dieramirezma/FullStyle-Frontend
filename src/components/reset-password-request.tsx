'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import Link from 'next/link'

const userSchema = z.object({
  email: z.string({
    required_error: 'El correo electrónico es obligatorio'
  }).email({
    message: 'Ingrese un correo válido'
  })
})

export default function ResetPasswordRequest () {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: ''
    }
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit (values: z.infer<typeof userSchema>) {
    setError('')
    setLoading(true)

    const payload = {
      email: values.email
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}user/reset-password-request`, payload)
      toast.success('Correo enviado', {
        description: 'Hemos enviado un correo con instrucciones para reestablecer tu contraseña.'
      })
    } catch (error: any) {
      toast.error('Error', {
        description: 'No se pudo enviar el correo de reestablecimiento de contraseña. Por favor, intenta de nuevo.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className="subtitle text-center">
          Reestablece tu contraseña
        </CardTitle>
        <CardDescription>Ingresa tu correo para enviarte un enlace de reestablecimiento de contraseña</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='flex flex-col gap-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
            <Link
              href='/login'
              className="text-center inline-block text-sm underline-offset-4 hover:underline"
            >
              Volver a iniciar sesión
            </Link>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Envía correo de recuperación'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
