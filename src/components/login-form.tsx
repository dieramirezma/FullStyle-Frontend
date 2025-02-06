'use client'

import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import Link from 'next/link'
import { GoogleIcon } from './icons/LogosGoogleIcon'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

const userSchema = z.object({
  email: z.string({
    required_error: 'El correo electrónico es obligatorio'
  }).min(1, {
    message: 'Ingresa el correo'
  }),
  password: z.string({
    required_error: 'La contraseña es obligatoria'
  }).min(1, {
    message: 'Ingresa la contraseña'
  })
})

export default function LoginForm () {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit (values: z.infer<typeof userSchema>) {
    setLoading(true)
    setError('')
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password
      })

      if ((res?.error) != null) {
        console.log('Error:', res.error)
        setError('Credenciales inválidas')
      } else {
        router.push('/customer')
      }
    } catch (err) {
      setError('Error al iniciar sesión. Inténtalo de nuevo')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', {
        callbackUrl: '/customer',
        redirect: false,
        prompt: 'login'
      })

      if ((result?.error) != null) {
        throw new Error('Error al iniciar sesión con Google')
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      setError('Ocurrió un error al intentar iniciar sesión con Google')
    }
  }

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle className="subtitle self-center">
          Iniciar Sesion
        </CardTitle>
        <CardDescription>Ingresa tu correo y contraseña para iniciar</CardDescription>
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
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem >
                  <div className='grid gap-2 '>
                    <div className='flex items-center'>
                      <FormLabel className='font-black'>Contraseña</FormLabel>
                      <Link
                        href="/register"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {(error !== '') && <p className="text-red-500 text-sm">{error}</p>}
            <div className="mt-2 text-center text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="underline underline-offset-4">
                ¡Registrate!
              </Link>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Iniciar Sesión'}
            </Button>
            <Button
              variant='outline'
              type="button"
              onClick={handleGoogleSignIn}
            >
              <GoogleIcon></GoogleIcon>
              Iniciar con Google
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
