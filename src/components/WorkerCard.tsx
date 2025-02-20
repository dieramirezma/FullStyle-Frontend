import Image from "next/image"

export interface Worker {
  id: number
  name: string
  site_id: number
  profilepicture: string
  description: string
  active: boolean
}

interface WorkerCardProps {
  worker: Worker
  onSelect: (worker: Worker) => void
}

export default function WorkerCard({ worker, onSelect }: WorkerCardProps) {
  return (
    <div
      className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onSelect(worker)}
    >
      <div className="flex items-center space-x-4">
        <Image
          src={worker.profilepicture || "/placeholder.svg"}
          alt={worker.name}
          width={64}
          height={64}
          className="rounded-full"
        />
        <div>
          <h3 className="text-lg font-semibold">{worker.name}</h3>
          <p className="text-sm text-gray-600">{worker.description}</p>
        </div>
      </div>
    </div>
  )
}
