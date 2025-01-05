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
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  function onSubmit (values: z.infer<typeof userSchema>) {
    console.log(values)
  }

  console.log(form.formState.errors)

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle className="subtitle2 self-center">
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
                        Forgot your password?
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
            <div className="mt-2 text-center text-sm">
              ¿No tienes cuenta?{' '}
              <Link href="#" className="underline underline-offset-4">
                ¡Registrate!
              </Link>
            </div>
            <Button type="submit">
              Iniciar Sesion</Button>
            <Button variant='outline'>
              <GoogleIcon></GoogleIcon>
              Iniciar con Google</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}