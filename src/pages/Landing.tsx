import { Nav } from '../components/layout/Nav'
import { Hero } from '../components/sections/Hero'
import { StatsStrip } from '../components/sections/StatsStrip'
import { HowItWorks } from '../components/sections/HowItWorks'
import { Features } from '../components/sections/Features'
import { CosmosHub } from '../components/sections/CosmosHub'
import { CtaFooter } from '../components/sections/CtaFooter'

/**
 * Landing page with all six sections.
 * Renders the marketing-focused view with wallet connection CTA.
 */
export function Landing() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <StatsStrip />
      <HowItWorks />
      <Features />
      <CosmosHub />
      <CtaFooter />
    </div>
  )
}
