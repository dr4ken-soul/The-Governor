import { FadeInView } from '../ui/FadeIn'

const columns = [
  {
    heading: 'Keplr Identity',
    body: 'Your real Cosmos Hub wallet address is your identity in the chamber.',
  },
  {
    heading: 'ATOM Stakes',
    body: 'All stakes and rewards mirror how ATOM works in real Cosmos Hub governance.',
  },
  {
    heading: 'Governance Types',
    body: 'Every proposal type in the game maps to a real Cosmos Hub governance category.',
  },
]

/**
 * Cosmos Hub connection section with three columns explaining the chain integration.
 * Demonstrates how the game ties into real Cosmos Hub infrastructure.
 */
export function CosmosHub() {
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
          Connected to Cosmos Hub
        </h2>
      </FadeInView>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0',
      }}>
        {columns.map((col, index) => (
          <FadeInView key={col.heading} delay={index * 0.1}>
            <div style={{
              padding: '0 32px',
              borderLeft: index > 0 ? '1px solid var(--border-subtle)' : 'none',
              textAlign: 'center',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '16px',
                color: 'var(--accent)',
                marginBottom: '12px',
              }}>
                {col.heading}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {col.body}
              </p>
            </div>
          </FadeInView>
        ))}
      </div>
    </section>
  )
}
