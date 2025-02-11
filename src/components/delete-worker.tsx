'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import apiClient from '@/utils/apiClient'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'

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

export default function DeleteWorker () {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [site, setSite] = useState<Site | null>(null)
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const manager_id = '62'
        const siteResponse = await apiClient.get(`site?manager_id=${manager_id}`)

        if (Array.isArray(siteResponse.data) && siteResponse.data.length > 0) {
          const siteData = siteResponse.data[0]
          setSite({
            id: siteData.id,
            name: siteData.name,
            address: siteData.address,
            phone: siteData.phone
          })

          const workersResponse = await apiClient.get(`worker?site_id=${siteData.id}`)
          const filteredWorkers = workersResponse.data.map((worker: any) => ({
            worker_id: worker.id,
            worker_name: worker.name
          }))
          setWorkers(filteredWorkers)
        } else {
          setError('No se encontró información del negocio.')
        }
      } catch (error) {
        console.error('Error al obtener datos:', error)
        setError('Error al obtener la información.')
      } finally {
        setLoading(false)
      }
    }

    if (session && session.user.active) {
      fetchData()
    }
  }, [session])

  if (status === 'loading') return <p>Cargando...</p>
  if (status !== 'authenticated') return <a href="/api/auth/signin">Iniciar sesión</a>
  if (!session.user.active) {
    return <p>Usuario no activo</p>
  }

  const handleDelete = async () => {
    if (!selectedWorkerId) {
      setError('Por favor, selecciona un trabajador para eliminar.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await apiClient.delete(`worker?id=${selectedWorkerId}`)
      console.log(`Eliminando trabajador con ID: ${selectedWorkerId}`)
      setSuccessMessage('')
      toast({
        title: 'Éxito',
        description: 'El empleado ha sido eliminado correctamente'
      })

      setWorkers((prevWorkers) => prevWorkers.filter((worker) => worker.worker_id.toString() !== selectedWorkerId))

      setSelectedWorkerId(null)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al eliminar el trabajador.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col items-center space-y-6 p-6 max-w-2xl mx-auto">
      {/* <Card className="w-full">
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
      </Card> */}

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Eliminar Trabajador</CardTitle>
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
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white"
            disabled={loading || !selectedWorkerId}
          >
            {loading ? 'Eliminando trabajador...' : 'Eliminar trabajador'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
