'use client'

import { useState } from 'react'
import useSWR from 'swr'
import {
  Wallet,
  Coins,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  TrendingUp,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface WalletData {
  balance: {
    balance: number
    total_earned: number
    total_withdrawn: number
  }
  sessions: Array<{
    id: string
    score: number
    tokens_earned: number
    duration_seconds: number
    created_at: string
  }>
  withdrawals: Array<{
    id: string
    amount: number
    wallet_address: string
    status: string
    tx_hash: string | null
    created_at: string
  }>
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const GRU_USD_ESTIMATE = 0.005 // $0.005 per $GRU (placeholder)

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: typeof Clock; className: string; label: string }> = {
    pending: { icon: Clock, className: 'text-accent bg-accent/10', label: 'Pending' },
    processing: { icon: Loader2, className: 'text-primary bg-primary/10', label: 'Processing' },
    completed: { icon: CheckCircle2, className: 'text-primary bg-primary/10', label: 'Completed' },
    failed: { icon: XCircle, className: 'text-destructive bg-destructive/10', label: 'Failed' },
  }
  const config = map[status] || map.pending
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className={`h-3 w-3 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {config.label}
    </span>
  )
}

export function WalletClient() {
  const { data, isLoading, mutate } = useSWR<WalletData>('/api/wallet', fetcher)
  const [walletAddress, setWalletAddress] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
  const [showWithdrawForm, setShowWithdrawForm] = useState(false)

  async function handleWithdraw(e: React.FormEvent) {
    e.preventDefault()
    setWithdrawing(true)

    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(withdrawAmount),
          walletAddress,
        }),
      })
      const result = await res.json()

      if (res.ok) {
        toast.success('Withdrawal request submitted!')
        setWalletAddress('')
        setWithdrawAmount('')
        setShowWithdrawForm(false)
        mutate()
      } else {
        toast.error(result.error || 'Withdrawal failed')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setWithdrawing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm">Loading wallet...</p>
      </div>
    )
  }

  const balance = data?.balance || { balance: 0, total_earned: 0, total_withdrawn: 0 }
  const usdValue = (Number(balance.balance) * GRU_USD_ESTIMATE).toFixed(2)

  return (
    <div className="mx-auto w-full max-w-3xl flex flex-col gap-6">
      {/* Balance Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card md:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardDescription className="text-muted-foreground">Available Balance</CardDescription>
                <CardTitle className="text-3xl text-card-foreground font-mono">
                  {Number(balance.balance).toFixed(1)} <span className="text-lg text-primary">$GRU</span>
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {'Estimated value: ~$'}{usdValue}{' USD'}
            </p>
            <div className="mt-4 flex gap-3">
              <Button
                onClick={() => setShowWithdrawForm(!showWithdrawForm)}
                className="gap-2"
                disabled={Number(balance.balance) < 100}
              >
                <ArrowUpRight className="h-4 w-4" />
                Withdraw
              </Button>
            </div>
            {Number(balance.balance) < 100 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Minimum 100 $GRU required to withdraw ({(100 - Number(balance.balance)).toFixed(1)} more needed)
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card className="border-border bg-card flex-1">
            <CardContent className="flex flex-col items-center justify-center py-5">
              <TrendingUp className="h-5 w-5 text-primary mb-1" />
              <span className="text-xs text-muted-foreground">Total Earned</span>
              <span className="text-xl font-bold text-card-foreground font-mono">
                {Number(balance.total_earned).toFixed(1)}
              </span>
            </CardContent>
          </Card>
          <Card className="border-border bg-card flex-1">
            <CardContent className="flex flex-col items-center justify-center py-5">
              <Download className="h-5 w-5 text-accent mb-1" />
              <span className="text-xs text-muted-foreground">Withdrawn</span>
              <span className="text-xl font-bold text-card-foreground font-mono">
                {Number(balance.total_withdrawn).toFixed(1)}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Withdraw Form */}
      {showWithdrawForm && (
        <Card className="border-primary/30 bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Withdraw $GRU</CardTitle>
            <CardDescription className="text-muted-foreground">
              Transfer tokens to your external wallet on Base L2
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="wallet" className="text-card-foreground">Wallet Address</Label>
                <Input
                  id="wallet"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount" className="text-card-foreground">Amount ($GRU)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={100}
                  max={Number(balance.balance)}
                  step={0.1}
                  placeholder="100"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  required
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground font-mono"
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" disabled={withdrawing} className="gap-2">
                  {withdrawing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Submit Withdrawal'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowWithdrawForm(false)}
                  className="border-border text-foreground"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Recent Games */}
      {data?.sessions && data.sessions.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Recent Games</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-border bg-secondary/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase">Score</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase">$GRU</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sessions.map((session) => (
                    <tr key={session.id} className="border-t border-border">
                      <td className="px-4 py-2.5 text-sm text-card-foreground">
                        {new Date(session.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-primary text-sm">
                        {session.score}
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm">
                        <span className="flex items-center justify-end gap-1">
                          <Coins className="h-3 w-3 text-accent" />
                          <span className="font-mono text-accent">{Number(session.tokens_earned).toFixed(1)}</span>
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right text-sm text-muted-foreground hidden sm:table-cell">
                        {session.duration_seconds}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Withdrawal History */}
      {data?.withdrawals && data.withdrawals.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-card-foreground">Withdrawal History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-border bg-secondary/50">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase">Date</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-muted-foreground uppercase">Amount</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase hidden sm:table-cell">Wallet</th>
                  </tr>
                </thead>
                <tbody>
                  {data.withdrawals.map((w) => (
                    <tr key={w.id} className="border-t border-border">
                      <td className="px-4 py-2.5 text-sm text-card-foreground">
                        {new Date(w.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-accent text-sm">
                        {Number(w.amount).toFixed(1)}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={w.status} />
                      </td>
                      <td className="px-4 py-2.5 text-sm text-muted-foreground font-mono hidden sm:table-cell">
                        {w.wallet_address.slice(0, 6)}...{w.wallet_address.slice(-4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
