import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Coins, Gamepad2 } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-36">
      {/* Background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(oklch(0.75 0.2 145) 1px, transparent 1px), linear-gradient(to right, oklch(0.75 0.2 145) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
          <Coins className="h-4 w-4 text-accent" />
          <span className="text-xs font-medium text-muted-foreground">
            Earn $GRU tokens while you play
          </span>
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Play Snake.{' '}
          <span className="text-primary">Earn Crypto.</span>
        </h1>

        <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          The classic game you love, now with real rewards. Every point you score earns you $GRU tokens redeemable for crypto.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 text-base">
            <Link href="/auth/sign-up">
              <Gamepad2 className="h-5 w-5" />
              Start Playing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base border-border text-foreground hover:bg-secondary">
            <Link href="#features">Learn More</Link>
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-foreground font-mono">10:1</span>
            <span>Points to $GRU</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-foreground font-mono">Base L2</span>
            <span>Low Gas Fees</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-foreground font-mono">Free</span>
            <span>To Play</span>
          </div>
        </div>
      </div>
    </section>
  )
}
