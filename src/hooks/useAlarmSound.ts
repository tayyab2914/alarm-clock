"use client"

import { useRef, useCallback } from "react"
import { AVAILABLE_SOUNDS } from "./useSounds"

export function useAlarmSound() {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const intervalRef = useRef<number | null>(null)
  const audioElementRef = useRef<HTMLAudioElement | null>(null)

  const startSound = useCallback((soundType?: string) => {
    if (soundType) {
      const sound = AVAILABLE_SOUNDS.find((s) => s.id === soundType)
      if (sound) {
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio()
        }
        audioElementRef.current.src = sound.path
        audioElementRef.current.loop = true
        audioElementRef.current.volume = 0.5
        audioElementRef.current.play().catch(() => {
          console.error("[v0] Failed to play alarm sound")
        })
        return
      }
    }

    // Fallback to oscillator-based sound
    if (audioContextRef.current) return

    audioContextRef.current = new AudioContext()
    gainNodeRef.current = audioContextRef.current.createGain()
    gainNodeRef.current.connect(audioContextRef.current.destination)
    gainNodeRef.current.gain.value = 0.3

    const playBeep = () => {
      if (!audioContextRef.current || !gainNodeRef.current) return

      const osc = audioContextRef.current.createOscillator()
      osc.type = "sine"
      osc.frequency.value = 880
      osc.connect(gainNodeRef.current)
      osc.start()
      osc.stop(audioContextRef.current.currentTime + 0.15)
    }

    // Play initial beep
    playBeep()

    // Repeat every 800ms
    intervalRef.current = window.setInterval(playBeep, 800)
  }, [])

  const stopSound = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause()
      audioElementRef.current.currentTime = 0
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop()
      } catch (e) {
        // Oscillator already stopped
      }
      oscillatorRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    gainNodeRef.current = null
  }, [])

  return { startSound, stopSound }
}
