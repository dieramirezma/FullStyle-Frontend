import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TimeRangeInputProps {
  day: string
  startTime: string
  endTime: string
  onChange: (day: string, startTime: string, endTime: string) => void
}

export function TimeRangeInput ({ day, startTime, endTime, onChange }: TimeRangeInputProps) {
  return (
    <div className="space-y-3 rounded-lg border p-3 sm:space-y-0 justify-around sm:flex sm:items-center sm:space-x-4">
      <Label className="block font-medium min-w-[5rem]">{day}:</Label>
      <div className="sm:flex sm:items-center sm:gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${day}-start`} className="text-sm text-muted-foreground">
            Inicio
          </Label>
          <Input
            id={`${day}-start`}
            type="time"
            value={startTime}
            onChange={(e) => { onChange(day, e.target.value, endTime) }}
            className="w-full"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${day}-end`} className="text-sm text-muted-foreground">
            Fin
          </Label>
          <Input
            id={`${day}-end`}
            type="time"
            value={endTime}
            onChange={(e) => { onChange(day, startTime, e.target.value) }}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
