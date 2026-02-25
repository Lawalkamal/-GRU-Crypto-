'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type Direction,
  type GameState,
  createInitialState,
  generateFood,
  getNextHead,
  getSpeedForScore,
  isCollision,
  isOppositeDirection,
  GRID_SIZE,
} from '@/lib/game-engine'

interface UseSnakeGameOptions {
  onGameOver?: (score: number, durationSeconds: number) => void
}

export function useSnakeGame({ onGameOver }: UseSnakeGameOptions = {}) {
  const [gameState, setGameState] = useState<GameState>(createInitialState)
  const directionQueueRef = useRef<Direction[]>([])
  const gameLoopRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = useRef<number>(0)

  const clearGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      clearTimeout(gameLoopRef.current)
      gameLoopRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    setGameState((prev) => {
      if (!prev.isRunning || prev.isGameOver) return prev

      let direction = prev.direction
      // Process direction queue
      while (directionQueueRef.current.length > 0) {
        const nextDir = directionQueueRef.current.shift()!
        if (!isOppositeDirection(direction, nextDir)) {
          direction = nextDir
          break
        }
      }

      const head = prev.snake[0]
      const nextHead = getNextHead(head, direction)

      if (isCollision(nextHead, prev.snake)) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000)
        // Defer the callback to avoid state update during render
        setTimeout(() => onGameOver?.(prev.score, duration), 0)
        return { ...prev, isRunning: false, isGameOver: true, direction }
      }

      const ate = nextHead.x === prev.food.x && nextHead.y === prev.food.y
      const newSnake = [nextHead, ...prev.snake]
      if (!ate) newSnake.pop()

      const newScore = ate ? prev.score + 1 : prev.score
      const newFood = ate ? generateFood(newSnake) : prev.food
      const newSpeed = getSpeedForScore(newScore)

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        direction,
        score: newScore,
        speed: newSpeed,
      }
    })
  }, [onGameOver])

  // Game loop
  useEffect(() => {
    if (gameState.isRunning && !gameState.isGameOver) {
      gameLoopRef.current = setTimeout(tick, gameState.speed)
      return () => clearGameLoop()
    }
  }, [gameState.isRunning, gameState.isGameOver, gameState.speed, gameState.snake, tick, clearGameLoop])

  const startGame = useCallback(() => {
    const initial = createInitialState()
    directionQueueRef.current = []
    startTimeRef.current = Date.now()
    setGameState({ ...initial, isRunning: true })
  }, [])

  const changeDirection = useCallback(
    (newDirection: Direction) => {
      if (!gameState.isRunning || gameState.isGameOver) return
      directionQueueRef.current.push(newDirection)
    },
    [gameState.isRunning, gameState.isGameOver],
  )

  const pauseGame = useCallback(() => {
    setGameState((prev) => ({ ...prev, isRunning: false }))
  }, [])

  const resumeGame = useCallback(() => {
    setGameState((prev) => {
      if (prev.isGameOver) return prev
      return { ...prev, isRunning: true }
    })
  }, [])

  return {
    gameState,
    startGame,
    changeDirection,
    pauseGame,
    resumeGame,
  }
}
