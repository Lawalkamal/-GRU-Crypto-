import { Card, CardContent } from '@/components/ui/card'

export function TokenomicsSection() {
  return (
    <section className="border-t border-border px-4 py-20 md:py-28">
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            $GRU Tokenomics
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple, transparent earning mechanics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mb-3 text-4xl font-bold text-primary font-mono">10:1</div>
              <div className="text-sm font-medium text-card-foreground">Earn Rate</div>
              <p className="mt-2 text-sm text-muted-foreground">
                10 in-game points = 1 $GRU token
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mb-3 text-4xl font-bold text-accent font-mono">ERC-20</div>
              <div className="text-sm font-medium text-card-foreground">Token Standard</div>
              <p className="mt-2 text-sm text-muted-foreground">
                On Base L2 for minimal gas fees
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card text-center">
            <CardContent className="pt-8 pb-8">
              <div className="mb-3 text-4xl font-bold text-foreground font-mono">100</div>
              <div className="text-sm font-medium text-card-foreground">Min. Withdrawal</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Minimum 100 $GRU to withdraw
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-border bg-secondary/50">
          <CardContent className="py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-card-foreground">Reward Pool</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  A dedicated smart contract holds the reward pool and distributes $GRU based on verified game scores. All transactions are transparent and auditable on-chain.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 whitespace-nowrap">
                <span className="text-sm font-medium text-primary">Base Chain</span>
                <span className="text-xs text-muted-foreground">{'(Coinbase L2)'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
