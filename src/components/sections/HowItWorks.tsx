import { FadeInView } from '../ui/FadeIn'

const steps = [
  {
    number: '01',
    heading: 'Connect your wallet',
    body: 'Connect your Keplr wallet and enter the chamber',
  },
  {
    number: '02',
    heading: 'Read and stake',
    body: 'Read the proposal and stake your ATOM on a vote',
  },
  {
    number: '03',
    heading: 'Earn rewards',
    body: 'Earn rewards when your vote aligns with the majority',
  },
]

/**
 * How It Works section with three numbered steps.
 * Scroll-triggered fade-up entrance animation.
 */
export function HowItWorks() {
  return (
    <section style={{
      padding: '100px 40px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <FadeInView>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '36px',
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '60px',
        }}>
          How it works
        </h2>
      </FadeInView>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '40px',
        position: 'relative',
      }}>
        {steps.map((step, index) => (
          <FadeInView key={step.number} delay={index * 0.1}>
            <div style={{
              position: 'relative',
              paddingLeft: index > 0 ? '40px' : '0',
              borderLeft: index > 0 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '48px',
                color: 'var(--accent-dim)',
                marginBottom: '16px',
                lineHeight: 1,
              }}>
                {step.number}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '20px',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                {step.heading}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {step.body}
              </p>
            </div>
          </FadeInView>
        ))}
      </div>
    </section>
  )
}
