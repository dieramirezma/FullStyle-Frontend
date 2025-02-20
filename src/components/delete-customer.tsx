'use client'

import { useState } from 'react'
import apiClient from '@/utils/apiClient'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useSession } from 'next-auth/react'
import { Label } from '@radix-ui/react-label'
import router from 'next/router'

export default function DeleteAccount () {
  const { data: session, status } = useSession()
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (status === 'loading') return <p>Cargando...</p>
  if (status !== 'authenticated') return <a href="/api/auth/signin">Iniciar sesión</a>
  if (!session.user.active) {
    setLoading(false)
  }
  const handleDelete = async () => {
    console.log(session.user)
    if (!session.user.id) {
      setError('No se pudo obtener el ID del usuario.')
      return
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      await apiClient.delete(`${process.env.NEXT_PUBLIC_API_URL}user/${session.user.id}`)
      setSuccessMessage('Cuenta eliminada correctamente.')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al eliminar la cuenta.')
    } finally {
      router.push('/customer')
      setLoading(false)
    }
  }

  return (

    <div className="flex flex-col items-center space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Información de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre:</Label>
            <div id="name" className="p-2 bg-gray-100 rounded-md">
              {session.user.name}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email:</Label>
            <div id="email" className="p-2 bg-gray-100 rounded-md">
              {session.user.email}
            </div>
          </div>
        </CardContent>
      </Card>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Cuenta eliminada' : 'Eliminar Cuenta'}
      </button>
    </div>
  )
}
