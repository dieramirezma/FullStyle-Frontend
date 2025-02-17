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
import { getSession, signIn } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff } from 'lucide-react'

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
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

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
        const session = await getSession()

        toast({
          title: 'Inicio de sesión exitoso',
          description: 'Bienvenido de nuevo'
        })
        if (session?.user) {
          const isManager = (session.user as any).is_manager
          router.push(isManager ? '/owner' : '/customer')
        }
      }
    } catch (err) {
      setError('Error al iniciar sesión. Inténtalo de nuevo')
      toast({
        title: 'Error al iniciar sesión',
        description: 'Inténtalo de nuevo',
        variant: 'destructive'
      })
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
          Iniciar Sesión
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
                    <Input
                      {...field}
                    />
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
                        href="/password_reset"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <div className='relative'>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                        </Button>
                      </div>
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
