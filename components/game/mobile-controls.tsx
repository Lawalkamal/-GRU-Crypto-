'use client'

import type { Direction } from '@/lib/game-engine'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react'

interface MobileControlsProps {
  onDirection: (dir: Direction) => void
  disabled: boolean
}

export function MobileControls({ onDirection, disabled }: MobileControlsProps) {
  const buttonClass =
    'flex h-14 w-14 items-center justify-center rounded-xl bg-secondary border border-border text-foreground active:bg-primary active:text-primary-foreground transition-colors disabled:opacity-30 touch-none select-none'

  return (
    <div className="flex flex-col items-center gap-2 md:hidden" role="group" aria-label="Game controls">
      <button
        className={buttonClass}
        onTouchStart={(e) => { e.preventDefault(); onDirection('UP') }}
        onClick={() => onDirection('UP')}
        disabled={disabled}
        aria-label="Move up"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
      <div className="flex gap-2">
        <button
          className={buttonClass}
          onTouchStart={(e) => { e.preventDefault(); onDirection('LEFT') }}
          onClick={() => onDirection('LEFT')}
          disabled={disabled}
          aria-label="Move left"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <button
          className={buttonClass}
          onTouchStart={(e) => { e.preventDefault(); onDirection('DOWN') }}
          onClick={() => onDirection('DOWN')}
          disabled={disabled}
          aria-label="Move down"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
        <button
          className={buttonClass}
          onTouchStart={(e) => { e.preventDefault(); onDirection('RIGHT') }}
          onClick={() => onDirection('RIGHT')}
          disabled={disabled}
          aria-label="Move right"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
