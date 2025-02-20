"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import apiClient from '@/utils/apiClient'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'

interface Worker {
  worker_id: number
  worker_name: string
}

interface Site {
  id: number
  name: string
  address: string
  phone: string
}

const userSchema = z.object({
  name: z.string({
    required_error: 'El nombre es obligatorio'
  }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras'
  }),
  description: z.string({
    required_error: 'Los apellidos son obligatorios'
  }).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'La descripcion solo puede contener letras'
  })
})

export default function EditWorker () {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [site, setSite] = useState<Site | null>(null)
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const manager_id = session?.user.id
        const siteResponse = await apiClient.get(`site?manager_id=${manager_id}`)

        if (Array.isArray(siteResponse.data) && siteResponse.data.length > 0) {
          const siteData = siteResponse.data[0]
          setSite({
            id: siteData.id,
            name: siteData.name,
            address: siteData.address,
            phone: siteData.phone,
          })

          const workersResponse = await apiClient.get(`worker?site_id=${siteData.id}`)
          const filteredWorkers = workersResponse.data.map((worker: any) => ({
            worker_id: worker.id,
            worker_name: worker.name,
          }))
          setWorkers(filteredWorkers)
        } else {
          setError("No se encontró información del negocio.")
        }
      } catch (error) {
        console.error("Error al obtener datos:", error)
        setError("Error al obtener la información.")
      } finally {
        setLoading(false)
      }
    }

    if (session && session.user.active) {
      fetchData()
    }
  }, [session])

  if (status === "loading") return <p>Cargando...</p>
  if (status !== "authenticated") return <a href="/api/auth/signin">Iniciar sesión</a>
  if (!session.user.active) {
    return <p>Usuario no activo</p>
  }

  const handleEdit = async (values: z.infer<typeof userSchema>) => {
    if (!selectedWorkerId) {
      setError("Por favor, selecciona un trabajador para editar.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    const payload = {
      name: values.name,
      site_id: site?.id,
      description: values.description
    }
    console.log(payload)
    try {
      await apiClient.put(`worker?id=${selectedWorkerId}`, payload)
      setWorkers(prevWorkers =>
        prevWorkers.map(worker =>
          worker.worker_id === Number(selectedWorkerId)
            ? { ...worker, worker_name: values.name }
            : worker
        )
      )
      setSuccessMessage("Trabajador actualizado correctamente.")
      form.setValue('name', '')
      form.setValue('description', '')
      setSelectedWorkerId(null)

    } catch (error: any) {
      setError(error.response?.data?.message || "Error al actualizar el trabajador.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col items-center space-y-6 p-6 max-w-2xl mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Información del Negocio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="font-semibold">
                Nombre:
              </Label>
              <div id="name" className="p-2 bg-gray-100 rounded-md">
                {site?.name}
              </div>
            </div>
            <div>
              <Label htmlFor="phone" className="font-semibold">
                Teléfono:
              </Label>
              <div id="phone" className="p-2 bg-gray-100 rounded-md">
                {site?.phone}
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="address" className="font-semibold">
              Dirección:
            </Label>
            <div id="address" className="p-2 bg-gray-100 rounded-md">
              {site?.address}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Actualizar Trabajador</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="worker-select" className="font-semibold">
              Selecciona un trabajador:
            </Label>
            <Select onValueChange={setSelectedWorkerId}>
              <SelectTrigger id="worker-select">
                <SelectValue placeholder="Selecciona un trabajador" />
              </SelectTrigger>
              <SelectContent>
                {workers.map((worker) => (
                  <SelectItem key={worker.worker_id} value={worker.worker_id.toString()}>
                    {worker.worker_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Form {...form}>
          <form className='flex flex-col gap-y-4' onSubmit={form.handleSubmit(handleEdit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Nuevo nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='font-black'>Nueva Descripcion</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        <div className="flex flex-col items-center">
          {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <Button
            type="submit" // ✅ Ahora el formulario manejará el submit correctamente
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={loading || !selectedWorkerId}
          >
            {loading ? "Actualizando trabajador..." : "Actualizar trabajador"}
          </Button>
        </div>
        </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  )
}
