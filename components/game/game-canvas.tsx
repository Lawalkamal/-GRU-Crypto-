'use client'

import { useRef, useEffect } from 'react'
import type { GameState, Direction } from '@/lib/game-engine'
import { GRID_SIZE } from '@/lib/game-engine'

interface GameCanvasProps {
  gameState: GameState
  onSwipe?: (direction: Direction) => void
}

export function GameCanvas({ gameState, onSwipe }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  // Handle touch swipe gestures
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || !onSwipe) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY
      const deltaX = endX - touchStartRef.current.x
      const deltaY = endY - touchStartRef.current.y

      // Minimum swipe distance to prevent accidental triggers
      const minSwipeDistance = 30

      // Determine dominant direction
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          onSwipe(deltaX > 0 ? 'RIGHT' : 'LEFT')
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          onSwipe(deltaY > 0 ? 'DOWN' : 'UP')
        }
      }

      touchStartRef.current = null
    }

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true })
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
    }
  }, [onSwipe])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const cellSize = rect.width / GRID_SIZE
    const { snake, food } = gameState

    // Clear
    ctx.fillStyle = 'oklch(0.11 0.01 260)'
    ctx.fillRect(0, 0, rect.width, rect.height)

    // Grid lines (subtle)
    ctx.strokeStyle = 'oklch(0.18 0.01 260)'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, rect.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(rect.width, i * cellSize)
      ctx.stroke()
    }

    // Snake body
    snake.forEach((segment, index) => {
      const x = segment.x * cellSize
      const y = segment.y * cellSize
      const padding = 1

      if (index === 0) {
        // Head - brighter green
        ctx.fillStyle = 'oklch(0.8 0.22 145)'
        ctx.shadowColor = 'oklch(0.75 0.2 145)'
        ctx.shadowBlur = 8
      } else {
        // Body - gradient fade
        const fade = Math.max(0.4, 1 - index / (snake.length + 5))
        ctx.fillStyle = `oklch(${0.55 + fade * 0.2} 0.18 145)`
        ctx.shadowBlur = 0
      }

      const radius = cellSize * 0.2
      const sx = x + padding
      const sy = y + padding
      const sw = cellSize - padding * 2
      const sh = cellSize - padding * 2

      ctx.beginPath()
      ctx.roundRect(sx, sy, sw, sh, radius)
      ctx.fill()
      ctx.shadowBlur = 0
    })

    // Food - gold with glow
    const fx = food.x * cellSize
    const fy = food.y * cellSize
    const foodPadding = 2

    ctx.fillStyle = 'oklch(0.82 0.17 85)'
    ctx.shadowColor = 'oklch(0.82 0.17 85)'
    ctx.shadowBlur = 12

    const foodRadius = (cellSize - foodPadding * 2) / 2
    ctx.beginPath()
    ctx.arc(
      fx + cellSize / 2,
      fy + cellSize / 2,
      foodRadius,
      0,
      Math.PI * 2,
    )
    ctx.fill()
    ctx.shadowBlur = 0

    // Game over overlay
    if (gameState.isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, rect.width, rect.height)

      ctx.fillStyle = 'oklch(0.95 0.01 260)'
      ctx.font = `bold ${cellSize * 1.5}px "Geist", sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('Game Over', rect.width / 2, rect.height / 2 - cellSize)

      ctx.fillStyle = 'oklch(0.75 0.2 145)'
      ctx.font = `bold ${cellSize}px "Geist Mono", monospace`
      ctx.fillText(`Score: ${gameState.score}`, rect.width / 2, rect.height / 2 + cellSize * 0.5)

      ctx.fillStyle = 'oklch(0.82 0.17 85)'
      ctx.font = `${cellSize * 0.7}px "Geist Mono", monospace`
      ctx.fillText(
        `+${(gameState.score / 10).toFixed(1)} $GRU`,
        rect.width / 2,
        rect.height / 2 + cellSize * 2,
      )
    }

    // Paused overlay
    if (!gameState.isRunning && !gameState.isGameOver && gameState.score > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fillRect(0, 0, rect.width, rect.height)
      ctx.fillStyle = 'oklch(0.95 0.01 260)'
      ctx.font = `bold ${cellSize * 1.2}px "Geist", sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('Paused', rect.width / 2, rect.height / 2)
    }
  }, [gameState])

  return (
    <canvas
      ref={canvasRef}
      className="aspect-square w-full max-w-[min(80vh,500px)] rounded-lg border border-border"
      style={{ imageRendering: 'pixelated', touchAction: 'none', userSelect: 'none' }}
    />
  )
}
