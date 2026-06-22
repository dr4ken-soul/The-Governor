import { motion } from 'framer-motion'
import { useKeplr } from '../../hooks/useKeplr'

/**
 * CTA footer section.
 * Full width with headline and single Connect Wallet button.
 */
export function CtaFooter() {
  const { connect, isConnected, connectionState } = useKeplr()

  return (
    <section style={{
      padding: '120px 40px',
      background: 'var(--bg-secondary)',
      textAlign: 'center',
    }}>
      <motion.h2
        initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
        whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(36px, 5vw, 64px)',
          color: 'var(--text-primary)',
          marginBottom: '32px',
        }}
      >
        The chamber is open.
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
        whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
      >
        {!isConnected ? (
          <button
            className="btn-accent"
            onClick={connect}
            disabled={connectionState === 'connecting'}
          >
            {connectionState === 'connecting' ? 'Connecting...' : 'Connect wallet'}
          </button>
        ) : (
          <a
            href="/app/chamber"
            className="btn-accent"
            style={{ textDecoration: 'none' }}
          >
            Enter chamber
          </a>
        )}
      </motion.div>
    </section>
  )
}
