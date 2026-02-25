import Link from 'next/link'

export function LandingFooter() {
  return (
    <footer className="border-t border-border px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
            <span className="text-xs font-bold text-primary-foreground font-mono">G</span>
          </div>
          <span className="text-sm font-semibold text-foreground">GRU Snake</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="/auth/login" className="hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">
            Play Now
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Built on Base L2. $GRU is an ERC-20 token.
        </p>
      </div>
    </footer>
  )
}
