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

export default function RegisterOwnerForm ({ urlCallback, siteId }: { urlCallback?: string, siteId?: string }) {
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
      const items = values.items
      localStorage.setItem('categories', items.toString())
      const promises = items.map(async (categoryId) => {
        if (siteId === undefined) {
          throw new Error('No se ha encontrado el sitio.')
        }
        const payload = {
          site_id: parseInt(siteId, 10),
          category_id: categoryId
        }
        return await axios.post(`${process.env.NEXT_PUBLIC_API_URL}site_has_category`, payload)
      })
      await Promise.all(promises)
      if (urlCallback !== undefined) {
        router.push(urlCallback)
      }
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
    <Card className='w-full md:w-auto'>
      <CardHeader>
        <CardTitle className="subtitle text-center">
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
                  <div className='grid gap-4 sm:grid-cols-2'>
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
            <Button type="submit" className='self-center' disabled={loading}>
              {loading ? 'Registrando...' : 'GUARDAR CATEGORIAS'}
            </Button>
          </form>

        </Form>
      </CardContent>
    </Card>
  )
}
