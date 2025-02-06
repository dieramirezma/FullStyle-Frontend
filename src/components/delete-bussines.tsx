'use client'

import { useEffect, useState } from 'react'
import apiClient from '@/utils/apiClient'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useSession } from 'next-auth/react'
import { Label } from '@radix-ui/react-label'
import axios from 'axios'
import { Button } from './ui/button'
import router from 'next/router'

export default function DeleteSite() {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [site, setSite] = useState<{ id: number; name: string; address: string; phone: string } | null>(null)

  
  useEffect(() => {
    const fetchSite = async () => {
      setError('')
      try {
        const manager_id = session?.user.id
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}site?manager_id=${manager_id}`)
        console.log("Datos del sitio:", response.data)

        
        if (Array.isArray(response.data) && response.data.length > 0) {
          setSite({
            id: response.data[0].id,
            name: response.data[0].name,
            address: response.data[0].address,
            phone: response.data[0].phone
          })
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
                {site?.name || "No disponible"}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección:</Label>
              <div id="address" className="p-2 bg-gray-100 rounded-md">
                {site?.address || "No disponible"}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono:</Label>
              <div id="phone" className="p-2 bg-gray-100 rounded-md">
                {site?.phone || "No disponible"}
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
