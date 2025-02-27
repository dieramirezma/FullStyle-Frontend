'use client'

import apiClient from '@/utils/apiClient'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil, Save, X, Trash2, ArrowRight, Building2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import RegisterBusinessForm from '@/components/register-business-form'
import LoadingSpinner from '@/components/loading-spinner'

interface Site {
  id: number
  name: string
  address: string
  phone: string
  manager_id: number
  photos?: string
}

function Page () {
  const { data: session, status } = useSession()
  const [site, setSite] = useState<Site>({ id: 0, name: '', address: '', phone: '', manager_id: 0 })
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Site | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<number | null>(null)

  const router = useRouter()

  const managerId = session?.user.id

  useEffect(() => {
    if (status === 'authenticated' && managerId) {
      fetchSite()
    }
  }, [managerId, status])

  const fetchSite = async () => {
    setLoading(true)
    try {
      const response = await apiClient.get(`site?manager_id=${managerId}`)
      const data: Site[] = response.data
      setSite(data[0])
      setFormData(data[0])
    } catch (error: any) {
      console.error('Error fetching site data:', error)
      if (error.response?.status === 404) {
        setError(404) // Guardamos el error 404
      } else {
        toast.error('Error', {
          description: 'No se pudo cargar la información del sitio'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData(site)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.put(`site?id=${site.id}`, formData)
      if (formData) {
        setSite(formData)
      }
      setIsEditing(false)
      toast.success('Éxito', {
        description: 'La información se actualizó correctamente'
      })
    } catch (error) {
      console.error('Error updating site:', error)
      toast.error('Error', {
        description: 'No se pudo actualizar la información'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await apiClient.delete(`site?id=${site.id}`)
      toast.success('Éxito', {
        description: 'El negocio ha sido eliminado correctamente'
      })
      // Redirigir al usuario a una página apropiada después de eliminar
      router.push('/owner') // Ajusta esta ruta según tu aplicación
    } catch (error) {
      console.error('Error deleting site:', error)
      toast.error('Error', {
        description: 'No se pudo eliminar el negocio'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner
          size='xl'
        />
      </div>
    )
  }

  if (error === 404) {
    return (
      <div className="container mx-auto max-w-4xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 sm:p-12">
          {/* Top illustration */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 max-w-lg mx-auto text-center">
            <h1 className="title">
              No tienes ningún negocio creado
            </h1>

            <p className="text-gray-500 text-lg">
              Crea tu primer negocio para comenzar a recibir reservas y gestionar tus servicios
            </p>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />

            <div className="bg-gray-50 rounded-lg">
              <RegisterBusinessForm
                className="w-full"
                urlCallback="/owner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="title tracking-tight">Tu negocio</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-3xl font-bold"></CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-2" disabled={isDeleting}>
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Eliminando...' : 'Eliminar negocio'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente tu negocio y toda la información
                  asociada a él.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg h-36">
              <Image src="/images/sites/site-example.png" fill alt={site.name} className="object-cover" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del negocio</Label>
                <Input id="name" name="name" value={formData?.name} onChange={handleChange} disabled={!isEditing} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData?.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" name="phone" value={formData?.phone} onChange={handleChange} disabled={!isEditing} />
              </div>

              <div className="flex justify-end space-x-2">
                {!isEditing
                  ? (
                  <Button type="button" onClick={handleEdit} className="flex items-center gap-2">
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                    )
                  : (
                  <>
                    <Button type="button" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                    <Button type="submit" className="flex items-center gap-2" disabled={loading}>
                      <Save className="h-4 w-4" />
                      Guardar
                    </Button>
                  </>
                    )}
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
