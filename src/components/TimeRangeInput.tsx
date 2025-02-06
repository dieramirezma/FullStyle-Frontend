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
    <div className="flex items-center space-x-4">
      <Label className="w-20">{day}:</Label>
      <div className="flex-1">
        <Input
          type="time"
          value={startTime}
          onChange={(e) => { onChange(day, e.target.value, endTime) }}
        />
      </div>
      <span>a</span>
      <div className="flex-1">
        <Input
          type="time"
          value={endTime}
          onChange={(e) => { onChange(day, startTime, e.target.value) }}
        />
      </div>
    </div>
  )
}
