"use client"

import { useState, useEffect } from "react"
import { Scheduler, WeekView, Appointments } from "@devexpress/dx-react-scheduler-material-ui"
import { ViewState } from "@devexpress/dx-react-scheduler"
import Paper from "@mui/material/Paper"

interface TimeSlot {
  start: string
  end: string
}

interface DaySchedule {
  available: TimeSlot[]
  occupied: TimeSlot[]
}

interface WorkerSchedule {
  worker_id: number
  week_start: string
  week_end: string
  schedule: Record<string, DaySchedule>
}

interface Appointment {
  title: string
  startDate: Date
  endDate: Date
  type: "available" | "occupied"
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function WorkerScheduler() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [currentDate, setCurrentDate] = useState("2025-02-17")

  useEffect(() => {
    // Simulating API call - replace with your actual API call
    const fetchSchedule = async () => {
      try {
        const response = await fetch("/api/schedule") // Replace with your API endpoint
        const data: WorkerSchedule = await response.json()
        const transformedAppointments = transformScheduleToAppointments(data)
        setAppointments(transformedAppointments)
        setCurrentDate(data.week_start)
      } catch (error) {
        console.error("Error fetching schedule:", error)
      }
    }

    fetchSchedule()
  }, [])

  const transformScheduleToAppointments = (schedule: WorkerSchedule): Appointment[] => {
    const appointments: Appointment[] = []
    const weekStart = new Date(schedule.week_start)

    DAYS_OF_WEEK.forEach((day, index) => {
      const currentDay = new Date(weekStart)
      currentDay.setDate(weekStart.getDate() + index)

      const daySchedule = schedule.schedule[day]
      if (!daySchedule) return

      // Add occupied slots
      daySchedule.occupied.forEach((slot) => {
        const [startHour, startMinute] = slot.start.split(":").map(Number)
        const [endHour, endMinute] = slot.end.split(":").map(Number)

        const startDate = new Date(currentDay)
        startDate.setHours(startHour, startMinute, 0)

        const endDate = new Date(currentDay)
        endDate.setHours(endHour, endMinute, 0)

        appointments.push({
          title: "Reservado",
          startDate,
          endDate,
          type: "occupied",
        })
      })

      // Add available slots
      daySchedule.available.forEach((slot) => {
        const [startHour, startMinute] = slot.start.split(":").map(Number)
        const [endHour, endMinute] = slot.end.split(":").map(Number)

        const startDate = new Date(currentDay)
        startDate.setHours(startHour, startMinute, 0)

        const endDate = new Date(currentDay)
        endDate.setHours(endHour, endMinute, 0)

        appointments.push({
          title: "Disponible",
          startDate,
          endDate,
          type: "available",
        })
      })
    })

    return appointments
  }

  const Appointment = ({ children, style, ...restProps }: any) => {
    const { type } = restProps.data

    return (
      <Appointments.Appointment
        {...restProps}
        style={{
          ...style,
          backgroundColor: type === "occupied" ? "#f87171" : "#6ee7b7",
          borderRadius: "8px",
        }}
      >
        {children}
      </Appointments.Appointment>
    )
  }

  return (
    <Paper>
      <Scheduler data={appointments} height={700}>
        <ViewState currentDate={currentDate} />
        <WeekView startDayHour={9} endDayHour={19} cellDuration={30} />
        <Appointments appointmentComponent={Appointment} />
      </Scheduler>
    </Paper>
  )
}

