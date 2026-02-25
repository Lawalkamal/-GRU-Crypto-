import { LeaderboardTable } from '@/components/leaderboard/leaderboard-table'

export default function LeaderboardPage() {
  return (
    <div className="flex flex-1 flex-col px-4 py-6">
      <div className="mx-auto w-full max-w-3xl">
        <LeaderboardTable />
      </div>
    </div>
  )
}
