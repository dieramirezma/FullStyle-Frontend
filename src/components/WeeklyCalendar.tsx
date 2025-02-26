"use client"

import { useState, useEffect, useCallback } from "react"
import { format, addDays, startOfWeek, endOfWeek, parse, addMinutes, isBefore, isAfter, isEqual } from "date-fns"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import apiClient from "@/utils/apiClient"
import type { Detail } from "@/app/customer/_components/site-search"
import { AppointmentConfirmationDialog } from "./appoinment-confirmation"
import { useToast } from "@/hooks/use-toast"
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

  const { toast } = useToast()

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

  const generateTimeSlots = (start: string, end: string): TimeSlot[] => {
    const slots: TimeSlot[] = []
    let currentTime = parse(start, "HH:mm:ss", new Date())
    const endTime = parse(end, "HH:mm:ss", new Date())

    while (isBefore(currentTime, endTime) || isEqual(currentTime, endTime)) {
      const slotEnd = addMinutes(currentTime, 30)
      slots.push({
        start: format(currentTime, "HH:mm"),
        end: format(slotEnd, "HH:mm"),
      })
      currentTime = slotEnd
    }

    return slots
  }

  const isSlotOccupied = (slot: TimeSlot, occupiedSlots: TimeSlot[]): boolean => {
    const slotStart = parse(slot.start, "HH:mm", new Date())
    const slotEnd = parse(slot.end, "HH:mm", new Date())

    return occupiedSlots.some((occupiedSlot) => {
      const occupiedStart = parse(occupiedSlot.start, "HH:mm:ss", new Date())
      const occupiedEnd = parse(occupiedSlot.end, "HH:mm:ss", new Date())

      return (
        ((isAfter(slotStart, occupiedStart) || isEqual(slotStart, occupiedStart)) &&
          isBefore(slotStart, occupiedEnd)) ||
        (isAfter(slotEnd, occupiedStart) && (isBefore(slotEnd, occupiedEnd) || isEqual(slotEnd, occupiedEnd))) ||
        (isBefore(slotStart, occupiedStart) && isAfter(slotEnd, occupiedEnd))
      )
    })
  }

  const handleSlotClick = (day: string, slot: TimeSlot) => {
    if (!schedule || isSlotOccupied(slot, schedule.schedule[day].occupied)) {
      return
    }
    const dayDate = parse(day, "EEEE", weekStart)
    const slotDate = addDays(weekStart, dayDate.getDay())
    setSelectedSlot(`${format(slotDate, "yyyy-MM-dd")}T${slot.start}`)
    setShowConfirmation(true)
  }

  const handleConfirmAppointment = async () => {
    if (!selectedSlot) return

    const [date, time] = selectedSlot.split("T")
    const appointmentData: AppointmentData = {
      appointmenttime: `${date}T${time}:00`,
      status: "pending",
      worker_id: workerId,
      site_id: siteId,
      service_id: serviceId,
      client_id: clientId,
    }

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
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {Object.entries(schedule.schedule).map(([day, daySchedule]) => {
            const dayDate = parse(day, "EEEE", weekStart)
            const slotDate = addDays(weekStart, dayDate.getDay())
            const timeSlots = generateTimeSlots(daySchedule.available[0]?.start, daySchedule.available[0]?.end)

            return (
              <Card key={day} className="border-0 shadow-none">
                <CardHeader className="p-2 pb-1.5">
                  <div className="text-sm font-semibold">{day}</div>
                  <div className="text-xs text-muted-foreground">{format(slotDate, "MMM d")}</div>
                </CardHeader>
                <CardContent className="p-1">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-1">
                      {timeSlots.map((slot, index) => {
                        const isOccupied = isSlotOccupied(slot, daySchedule.occupied)
                        return (
                          <button
                            key={index}
                            disabled={isOccupied}
                            onClick={() => !isOccupied && handleSlotClick(day, slot)}
                            className={`w-full rounded-md px-2 py-1.5 text-xs transition-colors
                              ${
                                isOccupied
                                  ? "bg-muted cursor-not-allowed opacity-50"
                                  : "bg-primary/10 hover:bg-primary/20 cursor-pointer"
                              }`}
                          >
                            {slot.start} - {slot.end}
                          </button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )
          })}
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
            onConfirm={handleConfirmAppointment}
          />
        )}
      </CardContent>
    </Card>
  )
}

