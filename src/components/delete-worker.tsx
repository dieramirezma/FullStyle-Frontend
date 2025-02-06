'use client'

import { useEffect, useState } from 'react'
import apiClient from '@/utils/apiClient'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useSession } from 'next-auth/react'
import { Label } from '@radix-ui/react-label'
import axios from 'axios'
import { Button } from './ui/button'
import router from 'next/router'

interface Worker {
  id: number
  name: string
}

export default function DeleteWorker() {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [workers, setWorkers] = useState<Worker[]>([])

  
  useEffect(() => {
    const fetchSite = async () => {
      try {
        const manager_id = 5
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}site?manager_id=${manager_id}`)
        if (Array.isArray(response.data) && response.data.length > 0) {
          const workers = await apiClient.get(`worker?site_id=${response.data[0].id}`)
          const filteredWorkers = workers.data.map((worker: any) => ({
            worker_id: worker.id,
            worker_name: worker.name
          }))
          setWorkers(filteredWorkers)
          console.log(filteredWorkers)
        } else {
          setError("No se encontró información del negocio.")
        }
      } catch (error) {
        console.error("Error al obtener el sitio:", error)
        setError("Error al obtener la información del negocio.")
      } finally {
        setLoading(false)
      }
    }
    fetchSite()
  }, [session, status])


  if (status === 'loading') return <p>Cargando...</p>
  if (status !== 'authenticated') return <a href="/api/auth/signin">Iniciar sesión</a>
  if(!session.user.active) {
    setLoading(false)
  }
  const handleDelete = async () => {
    if (!session.user.id) {
      setError('No se pudo obtener el ID del usuario.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await apiClient.delete(`${process.env.NEXT_PUBLIC_API_URL}site?id=${site?.id}`)
      setSuccessMessage('Sitio eliminada correctamente.')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al eliminar el sitio.')
    } finally {
      router.push('/customer')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Información del Negocio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre:</Label>
              <div id="name" className="p-2 bg-gray-100 rounded-md">
                lo que sea
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección:</Label>
              <div id="address" className="p-2 bg-gray-100 rounded-md">
              lo que sea
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono:</Label>
              <div id="phone" className="p-2 bg-gray-100 rounded-md">
              lo que sea
              </div>
            </div>
          </CardContent>
        </Card>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <Button
        type="submit"
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Eliminando sitio' : 'Eliminar sitio'}
      </Button>
    </div>
  )
}
