"use client"

import { useState, useEffect } from "react"
import WorkerCard from "../components/WorkerCard"
import WeeklyCalendar from "../components/WeeklyCalendar"
import apiClient from "../utils/apiClient" // Assuming you have this utility

export interface Worker {
  id: number
  name: string
  site_id: number
  profilepicture: string
  description: string
  active: boolean
}

export default function SelectWorker({ id, site }: { id: string; site: string }) {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`worker?site_id=${site}&service_id=${id}`)
        const data: Worker[] = response.data
        setWorkers(data)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Unable to load the workers.")
      }
    }
    if (site) {
      fetchData()
    }
  }, [site, id])

  const handleWorkerSelect = (worker: Worker) => {
    setSelectedWorker(worker)
  }

  const handleAppointmentScheduled = () => {
    // You can add any logic here after an appointment is scheduled
    // For example, showing a success message or resetting the selection
    setSelectedWorker(null)
    alert("Appointment scheduled successfully!")
  }

  return (
    <main className="flex flex-col gap-20 px-10 my-10 md:px-28">
      <section className="flex flex-col gap-10 w-full max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Select a Worker</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} onSelect={handleWorkerSelect} />
          ))}
        </div>
        {selectedWorker && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Schedule an Appointment with {selectedWorker.name}</h2>
            <WeeklyCalendar
              workerId={selectedWorker.id}
              siteId={Number.parseInt(site)}
              serviceId={Number.parseInt(id)}
              clientId={1} // You might want to pass this as a prop or get it from a context
              onAppointmentScheduled={handleAppointmentScheduled}
            />
          </div>
        )}
      </section>
    </main>
  )
}