'use client'

import useSWR from 'swr'
import { Trophy, Coins, Medal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface LeaderboardEntry {
  user_id: string
  username: string
  avatar_url: string | null
  high_score: number
  total_games: number
  total_earned: number
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function getRankStyle(rank: number) {
  if (rank === 1) return 'text-accent border-accent/30 bg-accent/5'
  if (rank === 2) return 'text-muted-foreground border-muted-foreground/30 bg-muted-foreground/5'
  if (rank === 3) return 'text-chart-5 border-chart-5/30 bg-chart-5/5'
  return 'text-muted-foreground border-border bg-card'
}

function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    return (
      <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${getRankStyle(rank)}`}>
        <Medal className="h-4 w-4" />
      </div>
    )
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card">
      <span className="text-xs font-mono text-muted-foreground">{rank}</span>
    </div>
  )
}

export function LeaderboardTable() {
  const { data, isLoading, error } = useSWR<LeaderboardEntry[]>('/api/leaderboard', fetcher, {
    refreshInterval: 30000,
  })

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm">Loading leaderboard...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">Failed to load leaderboard.</p>
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="text-center">
          <Trophy className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <CardTitle className="text-lg text-card-foreground">No games yet</CardTitle>
          <CardDescription className="text-muted-foreground">
            Be the first to play and claim the top spot!
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card overflow-hidden">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg text-card-foreground">Global Rankings</CardTitle>
            <CardDescription className="text-muted-foreground">
              Top players by high score
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Player
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  High Score
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Games
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  $GRU Earned
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <tr
                  key={entry.user_id}
                  className="border-t border-border transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3">
                    <RankBadge rank={index + 1} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-card-foreground">
                      {entry.username || `player_${entry.user_id.slice(0, 8)}`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono font-bold text-primary">{entry.high_score}</span>
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell">
                    <span className="text-sm text-muted-foreground">{entry.total_games}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Coins className="h-3.5 w-3.5 text-accent" />
                      <span className="font-mono text-sm text-accent">
                        {Number(entry.total_earned).toFixed(1)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
