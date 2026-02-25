import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-sm font-bold text-primary-foreground font-mono">G</span>
          </div>
          <span className="text-lg font-bold text-foreground">GRU Snake</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/sign-up">Play Now</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
