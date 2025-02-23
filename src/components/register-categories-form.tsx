'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Checkbox } from './ui/checkbox'

export const CATEGORIES: Array<{ id: number, label: string }> = [
  {
    id: 1,
    label: 'Corte de Cabello'
  },
  {
    id: 2,
    label: 'Coloración de Cabello'
  },
  {
    id: 3,
    label: 'Tratamientos Capilares'
  },
  {
    id: 4,
    label: 'Peinados'
  },
  {
    id: 5,
    label: 'Manicure y Pedicure'
  },
  {
    id: 6,
    label: 'Tratamientos Faciales'
  },
  {
    id: 7,
    label: 'Depilación'
  },
  {
    id: 8,
    label: 'Afeitado y Barbería'
  },
  {
    id: 9,
    label: 'Extensiones de Cabello'
  },
  {
    id: 10,
    label: 'Maquillaje Profesional'
  }
] as const

const userSchema = z.object({
  items: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: 'Tienes que seleccionar al menos una categoria.'
  })
})

export default function RegisterOwnerForm () {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      items: [1]
    }
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit (values: z.infer<typeof userSchema>) {
    setError('')
    setLoading(true)
    try {
      const siteId = localStorage.getItem('siteId')
      if (siteId == null) {
        throw new Error('No se encontró siteId en el localStorage')
      }
      const items = values.items
      localStorage.setItem('categories', items.toString())
      const promises = items.map(async (categoryId) => {
        const payload = {
          site_id: parseInt(siteId, 10),
          category_id: categoryId
        }
        return await axios.post(`${process.env.NEXT_PUBLIC_API_URL}site_has_category`, payload)
      })
      await Promise.all(promises)
      router.push('/register/services')
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
    <Card className='w-1/3'>
      <CardHeader>
        <CardTitle className="subtitle self-center">
          Registro de categorias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="items"
              render={() => (
                <FormItem>
                  <div className="mb-4 ">
                    <FormDescription className='text-lg'>
                      Selecciona las categorias de los servicios que vas a realizar.
                    </FormDescription>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                  {CATEGORIES.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="items"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox className='self-center'
                                checked={field.value?.includes(item.id)}
                                onCheckedChange={(checked) => {
                                  if (checked === true) {
                                    field.onChange([...field.value, item.id])
                                  } else {
                                    field.onChange(field.value?.filter((value) => value !== item.id
                                    )
                                    )
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal text-lg self-center">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {(error.length > 0) && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className='w-1/2 self-center' disabled={loading}>
              {loading ? 'Registrando...' : 'GUARDAR CATEGORIAS'}
            </Button>
          </form>

        </Form>
      </CardContent>
    </Card>
  )
}
