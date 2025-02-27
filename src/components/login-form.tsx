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
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

const userSchema = z.object({
  email: z
    .string({
      required_error: 'El correo electrónico es obligatorio'
    })
    .min(1, {
      message: 'Ingresa el correo'
    }),
  password: z
    .string({
      required_error: 'La contraseña es obligatoria'
    })
    .min(1, {
      message: 'Ingresa la contraseña'
    })
})

export default function LoginForm () {
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

  const onSubmit = async (values: z.infer<typeof userSchema>) => {
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

        toast.success('Éxito', {
          description: 'Inicio de sesión exitoso'
        })
        if (session?.user) {
          const isManager = (session.user as any).is_manager
          router.push(isManager ? '/owner' : '/customer')
        }
      }
    } catch (err) {
      setError('Error al iniciar sesión. Inténtalo de nuevo')
      toast.error('Error al iniciar sesión', {
        description: 'Inténtalo de nuevo'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
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
      setError('Ocurrió un error al iniciar sesión con Google')
      toast.error('Error', {
        description: 'Ocurrió un error al iniciar sesión con Google'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="subtitle self-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-center">Ingresa tu correo y contraseña para iniciar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Correo electrónico</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
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
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel className="font-semibold">Contraseña</FormLabel>
                      <Link href="/password_reset" className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} {...field} className="w-full pr-10" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword
                            ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                              )
                            : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                              )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <div className="text-center text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="underline underline-offset-4">
                ¡Registrate!
              </Link>
            </div>
            <div className="space-y-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </Button>
              <Button variant="outline" type="button" className="w-full" onClick={handleGoogleSignIn}>
                <GoogleIcon className="mr-2 h-5 w-5" />
                Iniciar con Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
