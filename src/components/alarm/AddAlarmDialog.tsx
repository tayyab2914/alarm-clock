"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Play } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useSounds } from "@/hooks/useSounds"

interface AddAlarmDialogProps {
  onAdd: (time: string, label?: string, difficultyLevel?: number, soundType?: string) => void
}

export function AddAlarmDialog({ onAdd }: AddAlarmDialogProps) {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState("07:00")
  const [label, setLabel] = useState("")
  const [difficultyLevel, setDifficultyLevel] = useState(8)
  const [selectedSound, setSelectedSound] = useState("alarm1")
  const { sounds, playingId, previewSound, stopPreview } = useSounds()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(time, label || undefined, difficultyLevel, selectedSound)
    stopPreview()
    setTime("07:00")
    setLabel("")
    setDifficultyLevel(8)
    setSelectedSound("alarm1")
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      stopPreview()
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          <div className="space-y-2">
            <Label>Alarm Sound</Label>
            <div className="grid grid-cols-2 gap-2">
              {sounds.map((sound) => (
                <button
                  key={sound.id}
                  type="button"
                  onClick={() => setSelectedSound(sound.id)}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                    selectedSound === sound.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-sm font-medium">{sound.name}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (playingId === sound.id) {
                        stopPreview()
                      } else {
                        previewSound(sound.id)
                      }
                    }}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="w-full">
            Add Alarm
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
