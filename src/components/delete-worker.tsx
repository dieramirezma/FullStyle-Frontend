'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import apiClient from '@/utils/apiClient'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { UserCircle2, Trash2, ArrowRight, Users } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'
import WorkerScheduleForm from './WorkerScheduleForm'

interface Worker {
  id: number
  name: string
  site_id: number
  profilepicture: string | null
  description: string
  active: boolean
}

interface Site {
  id: number
  name: string
  address: string
  phone: string
}

export default function DeleteWorker () {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [workers, setWorkers] = useState<Worker[]>([])
  const [site, setSite] = useState<Site | null>(null)
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null)
  const [error, setError] = useState<{ code: number, type: string } | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const managerId = session?.user.id
        const siteResponse = await apiClient.get(`site?manager_id=${managerId}`)

        if (Array.isArray(siteResponse.data) && siteResponse.data.length > 0) {
          const siteData = siteResponse.data[0]
          setSite({
            id: siteData.id,
            name: siteData.name,
            address: siteData.address,
            phone: siteData.phone
          })

          try {
            const workersResponse = await apiClient.get(`worker?site_id=${siteData.id}`)
            setWorkers(workersResponse.data)
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              setError({ code: 404, type: 'workers' })
            }
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setError({ code: 404, type: 'site' })
        }
      } finally {
        setLoading(false)
      }
    }

    if (session && session.user.active) {
      fetchData()
    }
  }, [session])

  const handleDelete = async (worker: Worker) => {
    setLoading(true)
    try {
      await apiClient.delete(`worker?id=${worker.id}`)
      setWorkers((prevWorkers) => prevWorkers.filter((w) => w.id !== worker.id))
      toast.success('Éxito', {
        description: 'El empleado ha sido eliminado correctamente'
      })
    } catch (error: any) {
      toast.error('Error', {
        description: error.response?.data?.message || 'Error al eliminar el trabajador.'
      })
    } finally {
      setLoading(false)
      setWorkerToDelete(null)
    }
  }

  if (status === 'loading') return <p>Cargando...</p>

  if (error?.code === 404 && error.type === 'workers') {
    return (
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 sm:p-12">
            {/* Top illustration */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 max-w-lg mx-auto text-center">
              <h1 className="title">
                No tienes ningún empleado creado
              </h1>

              <p className="text-gray-500 text-lg">
                Crea tu primer empleado para comenzar a gestionar tu negocio
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-8" />
              <div className="bg-gray-50 rounded-lg p-6 sm:p-8 text-left">
                <WorkerScheduleForm
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {workers.map((worker) => (
        <Card key={worker.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {worker.profilepicture
                ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  <Image
                    src={worker.profilepicture || '/placeholder.svg'}
                    alt={worker.name}
                    fill
                    className="object-cover"
                  />
                </div>
                  )
                : (
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <UserCircle2 className="w-16 h-16 text-muted-foreground" />
                </div>
                  )}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{worker.name}</h3>
                <p className="text-sm text-muted-foreground">{worker.description}</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => { setWorkerToDelete(worker) }}
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      <AlertDialog open={!!workerToDelete} onOpenChange={() => { setWorkerToDelete(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente a {workerToDelete?.name} y no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={async () => await (workerToDelete && handleDelete(workerToDelete))}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && (
        <div className="col-span-full text-center text-red-500">
          {error.type}
        </div>
      )}

      {workers.length === 0 && !loading && !error && (
        <div className="col-span-full text-center text-muted-foreground">
          No hay trabajadores registrados.
        </div>
      )}
    </div>
  )
}
