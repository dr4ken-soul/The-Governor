import { motion } from 'framer-motion'
import { staggerContainer, staggerChild } from '../ui/FadeIn'

const features = [
  {
    title: 'AI Proposals',
    body: 'Claude generates realistic Cosmos Hub governance proposals every round.',
  },
  {
    title: 'Stake to Vote',
    body: 'Lock simulated ATOM on your position before the chamber closes.',
  },
  {
    title: 'Majority Rewards',
    body: 'Vote with the winning side and earn a 1.5x return on your stake.',
  },
  {
    title: 'AI Narration',
    body: 'Claude delivers a political verdict when every vote is counted.',
  },
]

/**
 * Features section with four cards in a 2x2 grid.
 * Each card uses the liquid-glass class with blur-in stagger entrance.
 */
export function Features() {
  return (
    <section style={{
      padding: '100px 40px',
      background: 'var(--bg-secondary)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '36px',
            color: 'var(--text-primary)',
            textAlign: 'center',
            marginBottom: '60px',
          }}>
            Built for governance
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerChild}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="liquid-glass feature-card"
              style={{
                padding: '32px',
                borderRadius: '2px',
              }}
            >
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '18px',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}>
                {feature.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
