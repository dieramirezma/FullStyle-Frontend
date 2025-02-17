"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek, endOfWeek, parse, addMinutes, isBefore, isAfter, isEqual } from "date-fns"

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
  schedule: {
    [key: string]: DaySchedule
  }
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
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()))
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [loading, setLoading] = useState(true) // Added loading state

  useEffect(() => {
    setLoading(true) // Set loading to true before fetching
    fetchWeeklySchedule()
  }, [weekStart]) // Only weekStart is needed here

  const fetchWeeklySchedule = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/worker/weekly_schedule?worker_id=${workerId}&date=${format(weekStart, "yyyy-MM-dd")}`,
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: WeeklySchedule = await response.json()
      setSchedule(data)
    } catch (error) {
      console.error("Error fetching weekly schedule:", error)
    } finally {
      setLoading(false) // Set loading to false after fetching, regardless of success or failure
    }
  }

  const handlePreviousWeek = () => {
    setWeekStart((prevWeek) => addDays(prevWeek, -7))
  }

  const handleNextWeek = () => {
    setWeekStart((prevWeek) => addDays(prevWeek, 7))
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
    if (isSlotOccupied(slot, schedule.schedule[day].occupied)) {
      return // No hacer nada si el slot está ocupado
    }
    const dayDate = parse(day, "EEEE", weekStart)
    const slotDate = addDays(weekStart, dayDate.getDay())
    setSelectedSlot(`${format(slotDate, "yyyy-MM-dd")}T${slot.start}`)
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
      const response = await fetch("http://127.0.0.1:5000/api/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      onAppointmentScheduled()
    } catch (error) {
      console.error("Error scheduling appointment:", error)
    }
  }

  if (loading) return <div>Loading...</div> // Show loading indicator
  if (!schedule) return <div>No schedule available.</div> // Handle case where schedule is null

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePreviousWeek} className="px-4 py-2 bg-blue-500 text-white rounded">
          Previous Week
        </button>
        <span>
          {format(weekStart, "MMMM d, yyyy")} - {format(endOfWeek(weekStart), "MMMM d, yyyy")}
        </span>
        <button onClick={handleNextWeek} className="px-4 py-2 bg-blue-500 text-white rounded">
          Next Week
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Object.entries(schedule.schedule).map(([day, daySchedule]) => {
          const dayDate = parse(day, "EEEE", weekStart)
          const slotDate = addDays(weekStart, dayDate.getDay())
          const timeSlots = generateTimeSlots(daySchedule.available[0].start, daySchedule.available[0].end)

          return (
            <div key={day} className="border p-2">
              <h3 className="font-semibold">{day}</h3>
              <p className="text-xs text-gray-500">{format(slotDate, "MMM d")}</p>
              <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                {timeSlots.map((slot, index) => {
                  const isOccupied = isSlotOccupied(slot, daySchedule.occupied)
                  return (
                    <div
                      key={index}
                      className={`p-1 text-xs ${
                        isOccupied ? "bg-gray-300 cursor-not-allowed" : "bg-green-200 hover:bg-green-300 cursor-pointer"
                      }`}
                      onClick={() => !isOccupied && handleSlotClick(day, slot)}
                    >
                      {slot.start} - {slot.end}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {selectedSlot && (
        <div className="mt-4">
          <p>Selected slot: {format(new Date(selectedSlot), "MMMM d, yyyy HH:mm")}</p>
          <button onClick={handleConfirmAppointment} className="px-4 py-2 bg-green-500 text-white rounded mt-2">
            Confirm Appointment
          </button>
        </div>
      )}
    </div>
  )
}