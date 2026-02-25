'use client'

import { Coins } from 'lucide-react'

interface GameHudProps {
  score: number
  tokensEarned: number
  isRunning: boolean
}

export function GameHud({ score, tokensEarned, isRunning }: GameHudProps) {
  return (
    <div className="flex w-full max-w-[min(80vh,500px)] items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Score</span>
        <span className="text-2xl font-bold text-foreground font-mono">{score}</span>
      </div>

      <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5">
        {isRunning && (
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
        )}
        <span className="text-xs font-medium text-primary">
          {isRunning ? 'LIVE' : 'READY'}
        </span>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-xs text-muted-foreground">$GRU Earned</span>
        <div className="flex items-center gap-1.5">
          <Coins className="h-4 w-4 text-accent" />
          <span className="text-2xl font-bold text-accent font-mono">
            {tokensEarned.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  )
}
