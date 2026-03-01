'use client'

import { useCallback, useEffect } from 'react'
import { useSnakeGame } from '@/hooks/use-snake-game'
import { GameCanvas } from '@/components/game/game-canvas'
import { GameHud } from '@/components/game/game-hud'
import { MobileControls } from '@/components/game/mobile-controls'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { Direction } from '@/lib/game-engine'
import { Play, RotateCcw, Pause } from 'lucide-react'

export function SnakeGameClient() {
  const handleGameOver = useCallback(async (score: number, duration: number) => {
    if (score === 0) return

    try {
      const res = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, duration }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`+${data.tokens_earned} $GRU earned!`)
      } else {
        toast.error(data.error || 'Failed to save score')
      }
    } catch {
      toast.error('Network error saving score')
    }
  }, [])

  const { gameState, startGame, changeDirection, pauseGame, resumeGame } = useSnakeGame({
    onGameOver: handleGameOver,
  })

  // Keyboard controls
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const keyDirectionMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
      }

      const dir = keyDirectionMap[e.key]
      if (dir) {
        e.preventDefault()
        changeDirection(dir)
      }

      if (e.key === ' ') {
        e.preventDefault()
        if (gameState.isGameOver) {
          startGame()
        } else if (gameState.isRunning) {
          pauseGame()
        } else {
          resumeGame()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [changeDirection, gameState.isRunning, gameState.isGameOver, startGame, pauseGame, resumeGame])

  const tokensEarned = gameState.score / 10

  return (
    <div className="flex flex-col items-center gap-4">
      <GameHud
        score={gameState.score}
        tokensEarned={tokensEarned}
        isRunning={gameState.isRunning}
      />

      <GameCanvas gameState={gameState} onSwipe={changeDirection} />

      <div className="flex items-center gap-3">
        {!gameState.isRunning && !gameState.isGameOver && gameState.score === 0 && (
          <Button onClick={startGame} size="lg" className="gap-2">
            <Play className="h-5 w-5" />
            Start Game
          </Button>
        )}
        {gameState.isRunning && (
          <Button onClick={pauseGame} variant="outline" size="lg" className="gap-2 border-border text-foreground">
            <Pause className="h-5 w-5" />
            Pause
          </Button>
        )}
        {!gameState.isRunning && !gameState.isGameOver && gameState.score > 0 && (
          <Button onClick={resumeGame} size="lg" className="gap-2">
            <Play className="h-5 w-5" />
            Resume
          </Button>
        )}
        {gameState.isGameOver && (
          <Button onClick={startGame} size="lg" className="gap-2">
            <RotateCcw className="h-5 w-5" />
            Play Again
          </Button>
        )}
      </div>

      <MobileControls
        onDirection={changeDirection}
        disabled={!gameState.isRunning || gameState.isGameOver}
      />

      <p className="text-center text-xs text-muted-foreground">
        <span className="hidden md:inline">Use arrow keys or WASD to move. Space to pause.</span>
        <span className="md:hidden">Use the controls below to move the snake.</span>
      </p>
    </div>
  )
}
