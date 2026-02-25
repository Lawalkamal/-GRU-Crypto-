import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { TokenomicsSection } from '@/components/landing/tokenomics-section'
import { LandingNav } from '@/components/landing/landing-nav'
import { LandingFooter } from '@/components/landing/landing-footer'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingNav />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TokenomicsSection />
      </main>
      <LandingFooter />
    </div>
  )
}
