"use client"

import { useState, useCallback } from "react"

export interface Sound {
  id: string
  name: string
  path: string // Path in public folder
}

export const AVAILABLE_SOUNDS: Sound[] = [
  { id: "alarm1", name: "Alarm 1", path: "/sounds/alarm1.wav" },
  { id: "alarm2", name: "Alarm 2", path: "/sounds/alarm2.wav" },
  { id: "alarm3", name: "Alarm 3", path: "/sounds/alarm3.wav" },
  { id: "alarm4", name: "Alarm 4", path: "/sounds/alarm4.wav" },
]

export function useSounds() {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = new Audio()

  const previewSound = useCallback((soundId: string) => {
    const sound = AVAILABLE_SOUNDS.find((s) => s.id === soundId)
    if (!sound) return

    // Stop any currently playing sound
    if (audioRef.src) {
      audioRef.pause()
      audioRef.currentTime = 0
    }

    setPlayingId(soundId)
    audioRef.src = sound.path
    audioRef.play().catch(() => {
      console.error("[v0] Failed to play sound preview")
    })

    audioRef.onended = () => {
      setPlayingId(null)
    }
  }, [])

  const stopPreview = useCallback(() => {
    audioRef.pause()
    audioRef.currentTime = 0
    setPlayingId(null)
  }, [])

  return {
    sounds: AVAILABLE_SOUNDS,
    playingId,
    previewSound,
    stopPreview,
  }
}
