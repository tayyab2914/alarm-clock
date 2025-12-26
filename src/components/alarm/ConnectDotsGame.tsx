"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Dot } from "@/types/alarm"

interface ConnectDotsGameProps {
  onComplete: (elapsedSeconds: number) => void
  difficultyLevel?: number
}

function generateDots(count: number, width = 300, height = 300): Dot[] {
  const dots: Dot[] = []

  const radius = 20
  const padding = radius + 10
  const minDistance = radius * 2 + 10 // no overlap + margin
  const maxAttemptsPerDot = 100

  for (let i = 0; i < count; i++) {
    let placed = false

    for (let attempt = 0; attempt < maxAttemptsPerDot; attempt++) {
      const x = padding + Math.random() * (width - padding * 2)
      const y = padding + Math.random() * (height - padding * 2)

      const isValid = dots.every((dot) => Math.hypot(dot.x - x, dot.y - y) >= minDistance)

      if (isValid) {
        dots.push({ id: i + 1, x, y, connected: false })
        placed = true
        break
      }
    }

    if (!placed) {
      throw new Error("Unable to place dots without overlap. Reduce dot count or minDistance.")
    }
  }

  return dots
}

export function ConnectDotsGame({ onComplete, difficultyLevel = 8 }: ConnectDotsGameProps) {
  const [dots, setDots] = useState<Dot[]>(() => generateDots(difficultyLevel))
  const [nextDot, setNextDot] = useState(1)
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([])
  const [currentLine, setCurrentLine] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleDotClick = useCallback(
    (dot: Dot) => {
      if (dot.id !== nextDot) return

      setDots((prev) => prev.map((d) => (d.id === dot.id ? { ...d, connected: true } : d)))

      // Add line from previous dot to current dot
      if (nextDot > 1) {
        const prevDot = dots.find((d) => d.id === nextDot - 1)
        if (prevDot) {
          setLines((prev) => [...prev, { x1: prevDot.x, y1: prevDot.y, x2: dot.x, y2: dot.y }])
        }
      }

      if (nextDot === dots.length) {
        onComplete(elapsedSeconds)
      } else {
        setNextDot((prev) => prev + 1)
      }
    },
    [nextDot, dots, onComplete, elapsedSeconds],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (nextDot === 1 || !svgRef.current) return

      const rect = svgRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const prevDot = dots.find((d) => d.id === nextDot - 1)
      if (prevDot) {
        setCurrentLine({ x1: prevDot.x, y1: prevDot.y, x2: x, y2: y })
      }
    },
    [nextDot, dots],
  )

  const handlePointerLeave = useCallback(() => {
    setCurrentLine(null)
  }, [])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm font-mono text-primary">Time: {formatTime(elapsedSeconds)}</div>
      <p className="text-sm text-muted-foreground">
        Connect the dots in order: {nextDot} of {dots.length}
      </p>
      <svg
        ref={svgRef}
        width="300"
        height="300"
        className="bg-secondary/50 rounded-lg border touch-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {/* Completed lines */}
        {lines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}

        {/* Current line preview */}
        {currentLine && (
          <line
            x1={currentLine.x1}
            y1={currentLine.y1}
            x2={currentLine.x2}
            y2={currentLine.y2}
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="5,5"
            opacity="0.5"
          />
        )}

        {/* Dots */}
        {dots.map((dot) => (
          <g key={dot.id} onClick={() => handleDotClick(dot)} className="cursor-pointer">
            <circle
              cx={dot.x}
              cy={dot.y}
              r={dot.connected ? 16 : dot.id === nextDot ? 20 : 16}
              fill={
                dot.connected ? "hsl(var(--primary))" : dot.id === nextDot ? "hsl(var(--accent))" : "hsl(var(--muted))"
              }
              stroke={dot.id === nextDot ? "hsl(var(--primary))" : "transparent"}
              strokeWidth="3"
              className="transition-all duration-200"
            />
            <text
              x={dot.x}
              y={dot.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={dot.connected ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
              fontSize="14"
              fontWeight="500"
              className="pointer-events-none select-none"
            >
              {dot.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
