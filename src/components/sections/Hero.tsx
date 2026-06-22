import { motion } from 'framer-motion'
import { useKeplr } from '../../hooks/useKeplr'
import { staggerContainer, staggerChild } from '../ui/FadeIn'

/**
 * Hero section for the landing page.
 * Full viewport height with animated CSS grid background,
 * headline, subheadline and Connect Wallet CTA.
 */
export function Hero() {
  const { connect, isConnected, connectionState } = useKeplr()

  return (
    <section
      className="grid-background"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 40px',
      }}
    >
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '720px',
          paddingTop: '80px',
        }}
      >
        <motion.h1
          variants={staggerChild}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(40px, 6vw, 72px)',
            lineHeight: 1.05,
            color: 'var(--text-primary)',
            marginBottom: '20px',
          }}
        >
          Govern the Hub.{' '}
          <span style={{ display: 'block' }}>Win the Chamber.</span>
        </motion.h1>

        <motion.p
          variants={staggerChild}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: '20px',
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            marginBottom: '36px',
            maxWidth: '560px',
          }}
        >
          Stake ATOM, vote on AI-generated proposals and earn rewards when you read the room right.
        </motion.p>

        <motion.div
          variants={staggerChild}
          transition={{ duration: 0.5, ease: 'easeOut' }}
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
      </motion.div>

      {/* hero: add <img src="/hero.webp" /> here when image is provided */}
    </section>
  )
}
