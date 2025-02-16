"use client"

import { useState, useEffect } from "react"
import { format, addDays, startOfWeek, endOfWeek, parse } from "date-fns"

interface WeeklyCalendarProps {
  workerId: number
  siteId: number
  serviceId: number
  clientId: number
  onAppointmentScheduled: () => void
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
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()))
  const [schedule, setSchedule] = useState<WeeklySchedule | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  useEffect(() => {
    fetchWeeklySchedule()
  }, [workerId]) // Removed weekStart from dependencies

  const fetchWeeklySchedule = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/worker/weekly_schedule?worker_id=${workerId}&date=${format(weekStart, "yyyy-MM-dd")}`,
      )
      const data: WeeklySchedule = await response.json()
      setSchedule(data)
    } catch (error) {
      console.error("Error fetching weekly schedule:", error)
    }
  }

  const handlePreviousWeek = () => {
    setWeekStart((prevWeek) => addDays(prevWeek, -7))
  }

  const handleNextWeek = () => {
    setWeekStart((prevWeek) => addDays(prevWeek, 7))
  }

  const handleSlotClick = (day: string, start: string) => {
    const dayDate = parse(day, "EEEE", weekStart)
    const slotDate = addDays(weekStart, dayDate.getDay())
    setSelectedSlot(`${format(slotDate, "yyyy-MM-dd")}T${start}`)
  }

  const handleConfirmAppointment = async () => {
    if (!selectedSlot) return

    const [date, time] = selectedSlot.split("T")
    const appointmentData: AppointmentData = {
      appointmenttime: `${date}T${time}`,
      status: "pending",
      worker_id: workerId,
      site_id: siteId,
      service_id: serviceId,
      client_id: clientId,
    }

    console.log(appointmentData)

    try {
      const response = await fetch("http://127.0.0.1:5000/api/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      })

      if (response.ok) {
        onAppointmentScheduled()
      } else {
        console.error("Failed to schedule appointment")
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error)
    }
  }

  if (!schedule) return <div>Loading...</div>

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
          return (
            <div key={day} className="border p-2">
              <h3 className="font-semibold">{day}</h3>
              <p className="text-xs text-gray-500">{format(slotDate, "MMM d")}</p>
              {daySchedule.available.map((slot, index) => {
                const isOccupied = daySchedule.occupied.some(
                  (occupiedSlot) => occupiedSlot.start <= slot.start && occupiedSlot.end > slot.start,
                )
                return (
                  <div
                    key={index}
                    className={`p-1 my-1 text-xs cursor-pointer ${
                      isOccupied ? "bg-gray-300" : "bg-green-200 hover:bg-green-300"
                    }`}
                    onClick={() => !isOccupied && handleSlotClick(day, slot.start)}
                  >
                    {slot.start} - {slot.end}
                  </div>
                )
              })}
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