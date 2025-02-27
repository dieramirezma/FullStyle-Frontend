'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { MapPin, Loader2 } from 'lucide-react'
import GoogleMapComponent from '@/components/map'
import { useSession } from 'next-auth/react'

const businessTypes = ['Barbería', 'Peluquería', 'Salon de estética']

interface ResponseGeo {
  location: {
    lat: number
    lng: number
  }
  formatted_address: string
}

const userSchema = z.object({
  name: z
    .string({
      required_error: 'Este campo es obligatorio'
    })
    .min(5, {
      message: 'El nombre debe tener al menos 5 caracteres'
    })
    .max(50, {
      message: 'El nombre debe tener máximo 50 caracteres'
    }),
  address: z
    .string({
      required_error: 'Este campo es obligatorio'
    })
    .min(1, {
      message: 'La direccion es obligatoria'
    }),
  phone: z
    .string({
      required_error: 'Este campo es obligatorio'
    })
    .min(10, {
      message: 'Debe contener exactamente 10 dígitos'
    })
    .regex(/^[0-9]+$/, {
      message: 'El número telefónico solo puede contener números'
    })
    .max(10, {
      message: 'Debe contener exactamente 10 dígitos'
    })
    .regex(/^3/, {
      message: 'El número telefónico debe empezar por 3'
    }),
  businessType: z.enum(['Barbería', 'Peluquería', 'Salón de estética'], {
    message: 'Seleccione el tipo de negocio'
  })
})

export default function RegisterBusinessForm ({
  className,
  urlCallback,
  onRegistrationComplete
}: {
  className?: string
  urlCallback?: string
  onRegistrationComplete?: (siteId: string) => void
}) {
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: ''
    }
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null)
  const [showMap, setShowMap] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  async function validateAddress (address: string) {
    setAddressLoading(true)
    setError('')
    setCoords(null)

    try {
      // Append Bogota to the address if not already included
      const fullAddress = address.toLowerCase().includes('bogota') ? address : `${address}, Bogota`

      const res = await fetch(`/api/geocode?address=${encodeURIComponent(fullAddress)}`)
      const data: ResponseGeo = await res.json()

      if (res.ok) {
        setCoords(data.location)
        setShowMap(true)
        form.setValue('address', data.formatted_address)
      } else {
        setError('No se pudo encontrar la dirección. Por favor, verifique e intente nuevamente.')
      }
    } catch (err) {
      setError('Error al validar la dirección')
    } finally {
      setAddressLoading(false)
    }
  }

  async function onSubmit (values: z.infer<typeof userSchema>) {
    if (!coords) {
      setError('Por favor valide la dirección en el mapa antes de continuar')
      return
    }

    setError('')
    setLoading(true)
    const payload = {
      name: values.name.trim(),
      address: values.address,
      phone: values.phone,
      manager_id: session?.user?.id
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}site`, payload)
      const siteId = String(response.data.id)
      localStorage.setItem('siteId', siteId)

      if (onRegistrationComplete) {
        onRegistrationComplete(siteId)
      } else {
        router.push(urlCallback ?? '/owner')
      }
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

  return (
    <Card className={className ?? 'w-full md:w-1/2'}>
      <CardHeader>
        <CardTitle className="subtitle text-center">Registro del Negocio</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">
                    Nombre del negocio<span className="text-red-500"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej. FullStyle" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">
                    Direccion del negocio<span className="text-red-500"> *</span>
                  </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input className="h-auto" {...field} placeholder="Ej: Calle 123 #45-67" />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        await validateAddress(field.value)
                      }}
                      disabled={!field.value || addressLoading}
                    >
                      {addressLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                      <span className="ml-2">Validar</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showMap && coords && (
              <div className="mt-2 rounded-lg overflow-hidden border">
                <GoogleMapComponent position={coords} />
              </div>
            )}

            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">
                    Número telefónico<span className="text-red-500"> *</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} placeholder="Ej. 3033044340" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-black">
                    Tipo de negocio<span className="text-red-500"> *</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de negocio" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading || !coords}>
              {loading
                ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
                  )
                : (
                    'REGISTRARSE'
                  )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
