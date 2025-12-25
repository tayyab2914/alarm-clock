"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface AddAlarmDialogProps {
  onAdd: (time: string, label?: string, difficultyLevel?: number) => void
}

export function AddAlarmDialog({ onAdd }: AddAlarmDialogProps) {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState("07:00")
  const [label, setLabel] = useState("")
  const [difficultyLevel, setDifficultyLevel] = useState(8)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(time, label || undefined, difficultyLevel)
    setTime("07:00")
    setLabel("")
    setDifficultyLevel(8)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full w-14 h-14 shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Set New Alarm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-2xl h-14 text-center"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="label">Label (optional)</Label>
            <Input
              id="label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g., Wake up, Meeting..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty">Puzzle Difficulty: {difficultyLevel} dots</Label>
            <Slider
              id="difficulty"
              min={8}
              max={16}
              step={1}
              value={[difficultyLevel]}
              onValueChange={(value) => setDifficultyLevel(value[0])}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">More dots = harder puzzle</p>
          </div>
          <Button type="submit" className="w-full">
            Add Alarm
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
