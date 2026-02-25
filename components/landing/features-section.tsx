import { Wallet, Trophy, Shield, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
  {
    icon: Zap,
    title: 'No Wallet Needed',
    description:
      'Sign up with just your email. We create a smart contract wallet behind the scenes using Account Abstraction so you own your assets without MetaMask.',
  },
  {
    icon: Trophy,
    title: 'Global Leaderboard',
    description:
      'Compete with players worldwide. Climb the ranks, earn bragging rights, and watch your $GRU earnings stack up in real time.',
  },
  {
    icon: Wallet,
    title: 'Earn & Withdraw',
    description:
      'Every 10 points you score earns 1 $GRU token. Withdraw to any external wallet or redeem for in-app perks whenever you want.',
  },
  {
    icon: Shield,
    title: 'Anti-Cheat Verified',
    description:
      'All game scores are verified server-side with anti-cheat validation. Your earnings are legitimate and securely recorded on-chain.',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground md:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From sign up to withdrawal in four simple steps
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border bg-card transition-colors hover:border-primary/30"
            >
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg text-card-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
