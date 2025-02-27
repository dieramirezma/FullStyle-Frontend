"use client"

import { useState, useEffect, useCallback } from "react"
import { format, addDays, startOfWeek, endOfWeek, parse, addMinutes, isBefore, isAfter, isEqual } from "date-fns"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import apiClient from "@/utils/apiClient"
import type { Detail } from "@/app/customer/_components/site-search"
import { AppointmentConfirmationDialog } from "./appoinment-confirmation"
import { toast } from 'sonner'

import type { Site } from "./schedule-service"

// Keep all the interfaces as they were...
interface WeeklyCalendarProps {
  workerId: number
  siteId: number
  serviceId: number
  clientId: number
  onAppointmentScheduled: () => void
}

export interface Worker {
  id: number
  name: string
  site_id: number
  profilepicture: string
  description: string
  active: boolean
}

export interface TimeSlot {
  start: string
  end: string
}

export interface DaySchedule {
  available: TimeSlot[]
  occupied: TimeSlot[]
}

export interface WeeklySchedule {
  worker_id: number
  week_start: string
  week_end: string
  schedule: Record<string, DaySchedule>
}

export interface AppointmentData {
  appointmenttime: string
  status: string
  worker_id: number
  site_id: number
  service_id: number
  client_id: number
  request: boolean
}

export default function WeeklyCalendar({
  workerId,
  siteId,
  serviceId,
  clientId,
  onAppointmentScheduled,
}: WeeklyCalendarProps) {
  // Keep all the state and functions as they were...
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()))
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [serviceDetail, setServiceDetail] = useState<Detail[] | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [workerDetail, setWorkerDetail] = useState<Worker[] | null>(null)
  const [siteDetail, setSiteDetail] = useState<Site[] | null>(null)

  // Keep all the useEffect and fetch functions as they were...
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      await fetchWeeklySchedule()
      await fetchServiceDetail()
      await fetchWorkerDetail()
      await fetchSiteDetail()
    } finally {
      setLoading(false)
    }
  }, [weekStart, workerId, siteId, serviceId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchSiteDetail = async () => {
    try {
      const response = await apiClient.get(`site?id=${siteId}`)
      setSiteDetail(response.data as Site[])
    } catch (error) {
      console.error("Error fetching site detail:", error)
    }
  }

  const fetchWorkerDetail = async () => {
    try {
      const response = await apiClient.get(`worker?id=${workerId}`)
      setWorkerDetail(response.data as Worker[])
    } catch (error) {
      console.error("Error fetching worker detail:", error)
    }
  }

  const fetchWeeklySchedule = async () => {
    try {
      const response = await apiClient.get<WeeklySchedule>("worker/weekly_schedule", {
        params: {
          worker_id: workerId,
          date: format(weekStart, "yyyy-MM-dd"),
        },
      })
      console.log(weekStart)
      console.log(response.data)
      setSchedule(response.data)
    } catch (error) {
      console.error("Error fetching schedule:", error)
    }
  }

  const fetchServiceDetail = async () => {
    try {
      const response = await apiClient.get(`detail?service_id=${serviceId}&site_id=${siteId}`)
      const data = response.data as Detail[]
      setServiceDetail(data)
    } catch (error) {
      console.error("Error fetching service detail:", error)
    }
  }

  const handlePreviousWeek = () => {
    setWeekStart(addDays(weekStart, -7))
  }

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7))
  }

  const generateTimeSlots = (startTime: string, endTime: string): TimeSlot[] => {
    const slots: TimeSlot[] = []
    let current = parse(startTime, "HH:mm:ss", new Date())
    const end = parse(endTime, "HH:mm:ss", new Date())

    while (isBefore(current, end)) {
      const next = addMinutes(current, 30)
      if (isAfter(next, end)) break // Avoid exceeding the end time

      slots.push({
        start: format(current, "HH:mm"),
        end: format(next, "HH:mm"),
      })
      current = next
    }
    return slots
  }

  const isSlotOccupied = (slot: TimeSlot, occupiedSlots: { start: string; end: string }[] | undefined): boolean => {
    if (!occupiedSlots) return false
    return occupiedSlots.some((occupiedSlot) => {
      const slotStart = parse(slot.start, "HH:mm", new Date())
      const slotEnd = parse(slot.end, "HH:mm", new Date())
      const occupiedStart = parse(occupiedSlot.start, "HH:mm:ss", new Date())
      const occupiedEnd = parse(occupiedSlot.end, "HH:mm:ss", new Date())

      return (
        (isEqual(slotStart, occupiedStart) || isAfter(slotStart, occupiedStart)) && isBefore(slotStart, occupiedEnd)
      )
    })
  }

  const handleSlotClick = async (day: string, slot: TimeSlot) => {
    if (!schedule || isSlotOccupied(slot, schedule.schedule[day].occupied)) {
      return
    }

    const dayDate = parse(day, "EEEE", weekStart)
    const slotDate = addDays(weekStart, dayDate.getDay())
    const formattedSlot = `${format(slotDate, "yyyy-MM-dd")}T${slot.start}`

    setSelectedSlot(formattedSlot)

    const [date, time] = formattedSlot.split("T")
    const appointmentData: AppointmentData = {
      appointmenttime: `${date}T${time}:00`,
      status: "paid",
      worker_id: workerId,
      site_id: siteId,
      service_id: serviceId,
      client_id: clientId,
      request: true,
    }

    try {
      const response = await apiClient.post("appointment", appointmentData)
      setShowConfirmation(true)
    } catch (error: any) {
      if (error.response?.status === 400) {
        toast.error('Error al reservar agenda', {
          description: 'La duracion del servicio supera el tiempo disponible'
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo verificar la disponibilidad. Inténtalo nuevamente.",
        })
      }
      console.error("Error verifying appointment availability:", error)
    }
  }

  const handleAppointmentData = () => {
    if (!selectedSlot) return null
    const [date, time] = selectedSlot.split('T')
    const appointmentData: AppointmentData = {
      appointmenttime: `${date}T${time}:00`,
      status: "paid",
      worker_id: workerId,
      site_id: siteId,
      service_id: serviceId,
      client_id: clientId,
      request: true
    }
    console.log('weekly', appointmentData)
    return appointmentData
  }

  const handleConfirmAppointment = async () => {

    const appointmentData = handleAppointmentData()
    if (appointmentData === null) return

    try {
      const response = await apiClient.post("appointment", appointmentData)

      if (response.status !== 201) {
        throw new Error("Error al crear la reserva")
      }

      toast({
        title: "Reserva confirmada",
        description: "Tu reserva ha sido creada exitosamente",
      })

      setShowConfirmation(false)
      onAppointmentScheduled()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la reserva. Por favor, intenta nuevamente.",
      })
      console.error("Error scheduling appointment:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!schedule) {
    return (
      <div className="flex h-[400px] items-center justify-center text-muted-foreground">
        No hay un calendario disponible
      </div>
    )
  }

  const allTimeSlots = generateTimeSlots(
    schedule.schedule[Object.keys(schedule.schedule)[0]]?.available[0]?.start || "09:00:00",
    schedule.schedule[Object.keys(schedule.schedule)[0]]?.available[0]?.end || "17:00:00",
  )

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {format(weekStart, "MMMM d, yyyy")} - {format(endOfWeek(weekStart), "MMMM d, yyyy")}
        </span>
        <Button variant="outline" size="icon" onClick={handleNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[auto_repeat(7,1fr)]">
          {/* Header row with days */}
          <div className="sticky top-0 z-10 bg-background border-b">
            <div className="h-16" /> {/* Empty space above time column */}
          </div>
          {Object.entries(schedule.schedule).map(([day]) => {
            // Usamos el día de la semana para obtener el desplazamiento correcto desde weekStart
            const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
              .findIndex(d => d.toLowerCase() === day.toLowerCase())
            const slotDate = addDays(weekStart, dayIndex)
            return (
              <div key={day} className="border-b p-2 text-center">
                <div className="text-sm font-semibold">{day}</div>
                <div className="text-2xl font-semibold">{format(slotDate, "d")}</div>
              </div>
            );
          })}


          {/* Time slots column */}
          <div className="space-y-0 border-r">
            {allTimeSlots.map((slot, index) => (
              <div key={index} className="h-12 -mt-[1px] border-t pr-2 text-xs text-muted-foreground">
                <div className="relative -top-2 text-right">{slot.start}</div>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          {
            Object.entries(schedule.schedule).map(([day, daySchedule]) => (
              <div key={day} className="relative border-r">
                {allTimeSlots.map((slot, index) => {
                  const isOccupied = isSlotOccupied(slot, daySchedule.occupied)
                  return (
                    <button
                      key={index}
                      disabled={isOccupied}
                      onClick={() => !isOccupied && handleSlotClick(day, slot)}
                      className={`absolute w-full h-12 border-t -mt-[1px] transition-colors
                      ${isOccupied ? "bg-zinc-500 cursor-not-allowed" : "hover:bg-primary/5 cursor-pointer"}`}
                      style={{ top: `${index * 48}px` }}
                    />
                  )
                })}
              </div>
            ))
          }
        </div>

        {selectedSlot && serviceDetail && workerDetail && siteDetail && (
          <AppointmentConfirmationDialog
            isOpen={showConfirmation}
            onClose={() => {
              setShowConfirmation(false)
            }}
            selectedSlot={selectedSlot}
            serviceDetail={serviceDetail[0]}
            workerName={workerDetail[0].name}
            siteDetail={siteDetail[0]}
            appointmentData={handleAppointmentData()}
            onConfirm={handleConfirmAppointment}
          />
        )}
      </CardContent>
    </Card>
  )
}

