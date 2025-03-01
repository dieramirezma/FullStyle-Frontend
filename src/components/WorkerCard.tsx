import { cn } from '@/lib/utils'
import { UserCircle2 } from 'lucide-react'
import Image from 'next/image'

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

export default function WorkerCard ({ worker, onSelect }: WorkerCardProps) {
  return (
    <div
      className={cn(
        'group relative border rounded-xl p-4 cursor-pointer transition-all duration-200',
        'hover:shadow-md hover:border-primary/50'
      )}
      onClick={() => { onSelect(worker) }}
    >
      <div className="flex items-center gap-4">
        <div className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-muted">
          {worker.profilepicture
            ? (
            <Image src={worker.profilepicture || '/placeholder.svg'} alt={worker.name} fill className="object-cover" />
              )
            : (
            <div className="w-full h-full flex items-center justify-center bg-muted/30">
              <UserCircle2 className="w-12 h-12 text-muted-foreground" />
            </div>
              )}
        </div>

        <div className="min-w-0">
          <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">{worker.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{worker.description}</p>
        </div>
      </div>
    </div>
  )
}
