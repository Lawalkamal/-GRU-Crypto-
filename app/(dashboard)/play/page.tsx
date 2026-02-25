import { SnakeGameClient } from '@/components/game/snake-game-client'

export default function PlayPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
      <SnakeGameClient />
    </div>
  )
}
