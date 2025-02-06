import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Service {
  service_id: number
  site_id: number
  service_name: string
  price: number
  duration: number
}

interface EditServiceFormProps {
  service: Service
  onSave: (updatedService: Service) => void
  onCancel: () => void
}

export function EditServiceForm ({ service, onSave, onCancel }: EditServiceFormProps) {
  const [editedService, setEditedService] = useState<Service>(service)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditedService(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'duration' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedService)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* <div>
        <Label htmlFor="service_name">Nombre del servicio</Label>
        <Input
          id="service_name"
          name="service_name"
          value={editedService.service_name}
          onChange={handleChange}
          required
        />
      </div> */}
      <div>
        <Label htmlFor="price">Precio</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={editedService.price}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="duration">Duración (minutos)</Label>
        <Input
          id="duration"
          name="duration"
          type="number"
          value={editedService.duration}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}
