'use client'

import { useForm } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const banksNames = ['Bancolombia', 'Caja Social', 'Banco de Bogota', 'Mundo mujer']
const bankAcountTypes = ['Ahorros', 'Corriente']

const userSchema = z.object({
  name: z.string({
    required_error: 'El nombre es obligatorio'
  }).min(1, {
    message: 'Este campo es obligatorio'
  }).regex(/^[ a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras'
  }).max(99, {
    message: 'El limite de caracteres es de 99'
  }),
  lastName: z.string({
    required_error: 'Los apellidos son obligatorios'
  }).min(1, {
    message: 'Este campo es obligatorio'
  }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras'
  }).max(99, {
    message: 'El limite de caracteres es de 99'
  }),
  email: z.string({
    required_error: 'El correo electrónico es obligatorio'
  }).email({
    message: 'Ingrese un correo válido'
  }).max(99, {
    message: 'El limite de caracteres es de 99'
  }),
  phone: z.string({
    required_error: 'El numero es obligatorio'
  }).min(10, {
    message: 'Debe contener como minimo 10 dijitos'
  }).regex(/^[0-9]+$/, {
    message: 'El numero telefonico solo puede contener numeros'
  }).max(99, {
    message: 'El limite de caracteres es de 99'
  }),
  password: z.string({
    required_error: 'La contraseña es obligatoria'
  }).min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }).regex(/[A-Z]/,
    { message: 'La contraseña debe tener al menos una letra mayúscula' }).regex(/[\W_]/,
    { message: 'La contraseña debe tener al menos un carácter especial' }).regex(/[0-9]/,
    { message: 'La contraseña debe tener al menos un número' }),
  confirmPassword: z.string({
    required_error: 'Debe confirmar la contraseña'
  }),
  bankName: z.enum(['Bancolombia', 'Caja Social', 'Banco de Bogota', 'Mundo mujer'], {
    message: 'Seleccione su banco'
  }),
  bankAcountType: z.enum(['Ahorros', 'Corriente'], {
    message: 'Seleccione su tipo de cuenta'
  }),
  accountNumber: z.string({
    required_error: 'El numero es obligatorio'
  }).min(1, {
    message: 'Este campo es obligatorio'
  }).regex(/^[0-9]+$/, {
    message: 'El numero telefonico solo puede contener numeros'
  }).length(11, {
    message: 'El numero de cuenta debe contener 11 digitos'
  }).max(99, {
    message: 'El limite de caracteres es de 99'
  }),
  accountOwner: z.string({
    required_error: 'El nombre es obligatorio'
  }).min(1, {
    message: 'Este campo es obligatorio'
  }).max(99, {
    message: 'El limite de caracteres es de 99'
  })
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Las contraseñas no coinciden'
})

export default function RegisterOwnerForm () {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      accountNumber: '',
      accountOwner: ''
    }
  })

  function onSubmit (values: z.infer<typeof userSchema>) {
    console.log(values)
  }

  console.log(form.formState.errors)

  return (
    <Card className='w-1/2'>
      <CardHeader>
        <CardTitle className="subtitle2 self-center">
          Registro de Nuevo Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <CardDescription className='text-xl text-black '>Datos personales</CardDescription>
            <div className='grid grid-cols-2 gap-4'>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">Nombres</FormLabel>
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
                  <FormLabel className="font-black">Apellidos</FormLabel>
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
                  <FormLabel className="font-black">Correo electrónico</FormLabel>
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
                  <FormLabel className="font-black">Número telefónico</FormLabel>
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
                  <FormLabel className="font-black">Contraseña</FormLabel>
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
                  <FormLabel className="font-black">Confirmar Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <CardDescription className='text-xl text-black'>Datos bancarios</CardDescription>
            <div className='grid grid-cols-2 gap-4'>
              <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Nombre de la entidad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una entidad bancaria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        banksNames.map((bank) => (
                          <SelectItem key={ bank } value={ bank }>
                            { bank }
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="bankAcountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Tipo de cuenta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de cuenta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        bankAcountTypes.map((type) => (
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
              <FormField
              name="accountNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">Número de cuenta</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              name="accountOwner"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">Nombres</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <Button type="submit" className='w-1/2 self-center'>REGISTRARSE</Button>
            <Button variant="outline" className='w-1/2 self-center'>CONTINUAR CON GOOGLE</Button>
          </form>

        </Form>
      </CardContent>
    </Card>
  )
}
