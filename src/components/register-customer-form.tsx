'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from 'next-auth/react'
import { GoogleIcon } from './icons/LogosGoogleIcon'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { Checkbox } from './ui/checkbox'
import ReCAPTCHA from 'react-google-recaptcha'

const userSchema = z.object({
  names: z.string({
    required_error: 'Este campo es obligatorio'
  }).min(2, {
    message: 'El nombre debe contener como mínimo 2 caracteres'
  }).regex(/^[ a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras'
  }).max(40, {
    message: 'El limite de caracteres es de 40'
  }).refine(val => val.trim().split(' ').length <= 3, {
    message: 'Máximo 3 nombres'
  }),
  lastName: z.string({
    required_error: 'Este campo es obligatorio'
  }).min(3, {
    message: 'El apellido debe contener como mínimo 3 caracteres'
  }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'Los apellidos solo pueden contener letras'
  }).max(40, {
    message: 'El limite de caracteres es de 40'
  }).refine(val => val.trim().split(' ').length <= 2, {
    message: 'Máximo 2 apellidos'
  }),
  email: z.string({
    required_error: 'Este campo es obligatorio'
  }).email({
    message: 'Ingrese un correo válido'
  }).max(60, {
    message: 'El límite de caracteres es de 60'
  }),
  password: z.string({
    required_error: 'Este campo es obligatorio'
  }).min(8, {
    message: 'La contraseña debe tener al menos 8 caracteres'
  }).regex(/[A-Z]/,
    {
      message: 'La contraseña debe tener al menos una letra mayúscula'
    }).regex(/[\W_]/,
    {
      message: 'La contraseña debe tener al menos un carácter especial'
    }).regex(/[0-9]/,
    {
      message: 'La contraseña debe tener al menos un número'
    }).max(50, {
    message: 'La contraseña debe tener máximo 50 caracteres'
  }),
  confirmPassword: z.string({
    required_error: 'Debe confirmar la contraseña'
  }),
  acceptPolicy: z.boolean({
    required_error: 'Debes aceptar la política de tratamiento de datos'
  }).refine(val => val, {
    message: 'Debes aceptar la política de tratamiento de datos'
  })
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Las contraseñas no coinciden'
})

export default function RegisterCustomerForm () {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [isVerified, setIsVerified] = useState(false)
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

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

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
        callbackUrl: '/customer',
        redirect: false
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email
        }),
        credentials: 'include'
      })

      if (!response.ok) {
        const error = await response.json()
        setError(`Error en el backend: ${error.error}`)
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      setError('Ocurrió un error al intentar iniciar sesión con Google')
    }
  }

  async function handleCaptchaSubmission (token: string | null) {
    try {
      if (token) {
        await fetch('/api/recaptcha', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        })
        setIsVerified(true)
      }
    } catch (e) {
      setIsVerified(false)
    }
  }

  const handleChange = (token: string | null) => {
    handleCaptchaSubmission(token)
  }

  function handleExpired () {
    setIsVerified(false)
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className="subtitle text-center">
          Registro cliente
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
                  <FormLabel className='font-black'>Nombres<span className="text-red-500"> *</span></FormLabel>
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
                  <FormLabel className='font-black'>Apellidos<span className="text-red-500"> *</span></FormLabel>
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
                  <FormLabel className='font-black'>Correo electrónico<span className="text-red-500"> *</span></FormLabel>
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
                  <FormLabel className='font-black'>Contraseña<span className="text-red-500"> *</span></FormLabel>
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
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Confirmar Contraseña<span className="text-red-500"> *</span></FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acceptPolicy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Acepto la{' '}
                      <Link href="/legal/habeas-data" className="underline">
                        política de tratamiento de datos.
                      </Link>
                       <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className='flex justify-center'>
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''}
                ref={recaptchaRef}
                onChange={handleChange}
                onExpired={handleExpired}
              />
            </div>
            <Button type="submit" disabled={loading || !isVerified}>
              {loading ? 'Registrando...' : 'REGISTRARSE'}
            </Button>
            <Button
              variant='outline'
              type="button"
              onClick={handleGoogleSignIn}
              disabled={!isVerified}
            >
              <GoogleIcon/>
              CONTINUAR CON GOOGLE
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
