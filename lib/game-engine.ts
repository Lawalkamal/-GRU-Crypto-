export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type Position = { x: number; y: number }

export interface GameState {
  snake: Position[]
  food: Position
  direction: Direction
  score: number
  isRunning: boolean
  isGameOver: boolean
  speed: number
}

export const GRID_SIZE = 20
export const INITIAL_SPEED = 150

export function createInitialState(): GameState {
  const center = Math.floor(GRID_SIZE / 2)
  return {
    snake: [
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ],
    food: generateFood([
      { x: center, y: center },
      { x: center - 1, y: center },
      { x: center - 2, y: center },
    ]),
    direction: 'RIGHT',
    score: 0,
    isRunning: false,
    isGameOver: false,
    speed: INITIAL_SPEED,
  }
}

export function generateFood(snake: Position[]): Position {
  let food: Position
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y))
  return food
}

export function getNextHead(head: Position, direction: Direction): Position {
  switch (direction) {
    case 'UP':
      return { x: head.x, y: head.y - 1 }
    case 'DOWN':
      return { x: head.x, y: head.y + 1 }
    case 'LEFT':
      return { x: head.x - 1, y: head.y }
    case 'RIGHT':
      return { x: head.x + 1, y: head.y }
  }
}

export function isCollision(head: Position, snake: Position[]): boolean {
  // Wall collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true
  }
  // Self collision (skip head which hasn't been added yet)
  return snake.some((segment) => segment.x === head.x && segment.y === head.y)
}

export function isOppositeDirection(current: Direction, next: Direction): boolean {
  return (
    (current === 'UP' && next === 'DOWN') ||
    (current === 'DOWN' && next === 'UP') ||
    (current === 'LEFT' && next === 'RIGHT') ||
    (current === 'RIGHT' && next === 'LEFT')
  )
}

export function getSpeedForScore(score: number): number {
  // Gradually increase speed as score goes up
  return Math.max(60, INITIAL_SPEED - Math.floor(score / 5) * 8)
}
