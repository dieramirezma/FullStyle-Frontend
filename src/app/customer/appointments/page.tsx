'use client'

import { useState, useEffect } from 'react'
import { Calendar, CalendarCurrentDate, CalendarDayView, type CalendarEvent, CalendarMonthView, CalendarNextTrigger, CalendarPrevTrigger, CalendarTodayTrigger, CalendarViewTrigger, CalendarWeekView, CalendarYearView } from '@/components/ui/full-calendar'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import apiClient from '@/utils/apiClient'
import { useSession } from 'next-auth/react'

interface ApiAppointment {
  id: number
  appointmenttime: string
  status: string
  client_id: number
  worker: {
    id: number
    name: string
    site_id: number
    profilepicture: string | null
    description: string
    active: boolean
  }
  site: {
    id: number
    name: string
    address: string
    phone: string
    manager_id: number
    photos: string | null
  }
  service: {
    service_id: number
    name: string
    site_id: number
    description: string
    price: number
    duration: number
    photos: string | null
    active: boolean
  }
}

export function mapApiToCalendarEvent (apiData: ApiAppointment): CalendarEvent {
  const startDate = new Date(apiData.appointmenttime)
  startDate.setSeconds(0, 0)

  const endDate = new Date(startDate)
  endDate.setMinutes(startDate.getMinutes() + apiData.service.duration)
  endDate.setSeconds(0, 0)

  return {
    id: apiData.id.toString(),
    start: startDate,
    end: endDate,
    color: apiData.status === 'pending' ? 'purple' : 'blue',
    status: apiData.status,
    clientId: apiData.client_id,
    worker: {
      id: apiData.worker.id,
      name: apiData.worker.name,
      profilePicture: apiData.worker.profilepicture,
      description: apiData.worker.description
    },
    site: {
      id: apiData.site.id,
      name: apiData.site.name,
      address: apiData.site.address,
      phone: apiData.site.phone
    },
    service: {
      id: apiData.service.service_id,
      name: apiData.service.name,
      description: apiData.service.description,
      price: apiData.service.price,
      duration: apiData.service.duration
    }
  }
}

function Page () {
  const [isClient, setIsClient] = useState(false)
  const [appointments, setAppointments] = useState<CalendarEvent[]>([])

  const { data: session } = useSession()

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!session) return
      try {
        const response = await apiClient.get(`appointmentdetail?client_id=${session?.user.id}`)
        const mappedAppointments: CalendarEvent[] = response.data
          .map(mapApiToCalendarEvent)
          .filter((appointment: CalendarEvent) => appointment.status === 'paid')

        setAppointments(mappedAppointments)
        console.log(new Date('2025-02-26T11:30:00Z'))
        console.log('Appointments:', mappedAppointments)
      } catch (error) {
        console.error('Error fetching appointments:', error)
      }
    }
    fetchAppointments()
  }, [session])

  useEffect(() => {
    setIsClient(true)
  }, [])

  // const events: CalendarEvent[] = [
  //   {
  //     id: '28',
  //     start: new Date('2025-02-24T12:30:00.000Z'),
  //     end: new Date('2025-02-24T13:30:00.000Z'),
  //     color: 'purple',
  //     status: 'pending',
  //     clientId: 87,
  //     worker: {
  //       id: 78,
  //       name: 'Trabajador test agenda uno',
  //       profilePicture: null,
  //       description: 'Descripcion Trabajador test agenda uno'
  //     },
  //     site: {
  //       id: 66,
  //       name: 'TestAgenda',
  //       address: 'TestAgenda1',
  //       phone: '2312133121'
  //     },
  //     service: {
  //       id: 1,
  //       name: 'Corte Simple',
  //       description: 'Corte simple',
  //       price: 10000,
  //       duration: 60
  //     }
  //   },
  //   {
  //     id: '29',
  //     start: new Date('2025-02-27T12:00:00.000Z'),
  //     end: new Date('2025-02-27T13:00:00.000Z'),
  //     color: 'blue',
  //     status: 'paid',
  //     clientId: 87,
  //     worker: {
  //       id: 79,
  //       name: 'Trabajador test agenda dos',
  //       profilePicture: null,
  //       description: 'Descripcion Trabajador test agenda dos'
  //     },
  //     site: {
  //       id: 66,
  //       name: 'TestAgenda',
  //       address: 'TestAgenda1',
  //       phone: '2312133121'
  //     },
  //     service: {
  //       id: 1,
  //       name: 'Corte Simple',
  //       description: 'Corte simple',
  //       price: 10000,
  //       duration: 60
  //     }
  //   }
  // ]
  //   {
  //     id: '2',
  //     start: new Date('2025-02-26T11:30:00Z'),
  //     end: new Date('2025-02-26T12:30:00Z'),
  //     title: 'Corte corriente con el felipangas 2',
  //     color: 'blue',
  //     service: {
  //       id: 1,
  //       name: 'FullStyle2',
  //       description: 'Descripcion de prueba2',
  //       price: 25000,
  //       duration: 30
  //     }
  //   }
  // ]

  if (!isClient || !appointments) {
    return <div className="h-dvh flex items-center justify-center">Cargando calendario de citas...</div>
  }

  return (
    <>
      {appointments.length > 0 && (
        <Calendar events={appointments}>
          <div className="h-dvh py-6 flex flex-col">
            <div className="flex px-6 items-center gap-2 mb-6">
              <CalendarViewTrigger className="aria-[current=true]:bg-accent" view="day">
                Day
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="week"
                className="aria-[current=true]:bg-accent"
              >
                Week
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="month"
                className="aria-[current=true]:bg-accent"
              >
                Month
              </CalendarViewTrigger>
              <CalendarViewTrigger
                view="year"
                className="aria-[current=true]:bg-accent"
              >
                Year
              </CalendarViewTrigger>

              <span className="flex-1" />

              <CalendarCurrentDate />

              <CalendarPrevTrigger>
                <ChevronLeft size={20} />
                <span className="sr-only">Previous</span>
              </CalendarPrevTrigger>

              <CalendarTodayTrigger>Today</CalendarTodayTrigger>

              <CalendarNextTrigger>
                <ChevronRight size={20} />
                <span className="sr-only">Next</span>
              </CalendarNextTrigger>
            </div>

            <div className="flex-1 overflow-auto px-6 relative">
              <CalendarDayView />
              <CalendarWeekView />
              <CalendarMonthView />
              <CalendarYearView />
            </div>
          </div>
        </Calendar>
      )}
    </>
  )
}

export default Page
