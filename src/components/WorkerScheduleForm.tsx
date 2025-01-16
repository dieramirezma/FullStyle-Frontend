'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { TimeRangeInput } from './TimeRangeInput'
import axios from 'axios'
import Link from 'next/link'

type Schedule = Record<string, { startTime: string, endTime: string }>

interface WorkerData {
  name: string
  description: string
  schedule: Schedule
}

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
export default function WorkerScheduleForm () {
  const [workerData, setWorkerData] = useState<WorkerData>({
    name: '',
    description: '',
    schedule: DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { startTime: '', endTime: '' }
    }), {})
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setWorkerData(prev => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleTimeChange = (day: string, startTime: string, endTime: string) => {
    setWorkerData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { startTime, endTime }
      }
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    setSuccessMessage('')
    e.preventDefault()

    if (workerData.name.trim().length === 0) {
      setError('El nombre del trabajador es requerido.')
      return
    }
    for (const day of DAYS) {
      const { startTime, endTime } = workerData.schedule[day]
      if ((startTime.length > 0) && (endTime.length > 0) && startTime >= endTime) {
        setError(`Para ${day}, la hora de fin debe ser posterior a la hora de inicio.`)
        return
      }
    }
    const siteId = localStorage.getItem('siteId')
    if (siteId == null) {
      setError('No se encontró el site_id en el localStorage.')
      return
    }

    const payload = {
      name: workerData.name,
      site_id: parseInt(siteId, 10),
      description: workerData.description
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}worker`, payload)
      localStorage.setItem('workerId', String(response.data.id))
      setError(null)
    } catch (error: any) {
      setSuccessMessage('')
      if (error.response.data.message !== undefined) {
        setError(String(error.response.data.message))
      } else {
        setError('Ocurrió un error inesperado. Inténtalo de nuevo más tarde.')
      }
    } finally {
      setLoading(false)
    }

    try {
      const workerId = localStorage.getItem('workerId')
      if (workerId == null) {
        throw new Error('El workerId no se encuentra en el localStorage.')
      }
      const requests = Object.entries(workerData.schedule).map(([day, time]) => ({
        worker_id: parseInt(workerId, 10),
        weekday: day,
        starttime: time.startTime,
        endtime: time.endTime
      }))
      const responses = await Promise.all(
        requests.map(async data =>
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}availability`, data)
        )
      )
      setSuccessMessage('Servicio agregado de forma exitosa')
    } catch (error: any) {
      setSuccessMessage('')
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
    <Card className="w-full max-w-2xl ">
      <CardHeader>
        <CardTitle>Registro de Trabajador y Horario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del trabajador:</Label>
            <Input
              id="name"
              name="name"
              value={workerData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción:</Label>
            <Textarea
              id="description"
              name="description"
              value={workerData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Horario de trabajo:</Label>
            {DAYS.map(day => (
              <TimeRangeInput
                key={day}
                day={day}
                startTime={workerData.schedule[day].startTime}
                endTime={workerData.schedule[day].endTime}
                onChange={handleTimeChange}
              />
            ))}
          </div>
          {(successMessage.length > 0) && !loading && (
              <p className="text-green-500 text-sm self-center">{successMessage}</p>
          )}
          {(error != null) && <p className="text-red-500">{error}</p>}
        </form>
      </CardContent>
      <CardFooter className="flex-col justify-center ">
        <Button type="submit" onClick={handleSubmit} disabled={loading} className='w-1/3 my-2'>
          {loading ? 'Agregando...' : 'AGREGAR TRABAJADOR'}
        </Button>
        <Button variant='outline' className='w-1/3'>
          <Link href="/login">Finalizar registro</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}