import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useKeplr } from '../../hooks/useKeplr'

/**
 * CTA footer section.
 * Full width with headline and single Connect Wallet button.
 * Connects wallet first, then navigates to the chamber.
 */
export function CtaFooter() {
  const { connect, isConnected, connectionState } = useKeplr()
  const navigate = useNavigate()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleCta = async () => {
    if (isConnected) {
      navigate('/app/chamber')
      return
    }
    setIsTransitioning(true)
    const addr = await connect()
    if (addr) {
      await new Promise((r) => setTimeout(r, 800))
      navigate('/app/chamber')
    }
    setIsTransitioning(false)
  }

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
        <button
          className="btn-accent"
          onClick={handleCta}
          disabled={connectionState === 'connecting' || isTransitioning}
        >
          {connectionState === 'connecting' || isTransitioning
            ? 'Connecting...'
            : isConnected
              ? 'Enter chamber'
              : 'Connect wallet to start'}
        </button>
      </motion.div>
    </section>
  )
}
