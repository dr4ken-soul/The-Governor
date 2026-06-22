import { motion } from 'framer-motion'
import type { Proposal } from '../../types'

interface ProposalCardProps {
  proposal: Proposal
}

/**
 * Displays a governance proposal with title, type badge, difficulty badge,
 * summary, and for/against arguments in two columns.
 * @param proposal - The proposal to display
 */
export function ProposalCard({ proposal }: ProposalCardProps) {
  /**
   * Returns the colour for the difficulty badge based on the difficulty rating.
   */
  const getDifficultyColour = (difficulty: string): string => {
    switch (difficulty) {
      case 'straightforward': return 'var(--text-muted)'
      case 'contested': return 'var(--accent-dim)'
      case 'divisive': return 'var(--accent)'
      default: return 'var(--text-muted)'
    }
  }

  /**
   * Formats the proposal type for display.
   */
  const formatType = (type: string): string => {
    return type.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
  }

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="liquid-glass"
      style={{
        padding: '28px',
        borderRadius: '2px',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          background: 'var(--bg-elevated)',
          padding: '4px 8px',
          borderRadius: '2px',
          letterSpacing: '0.05em',
        }}>
          {formatType(proposal.type)}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          textTransform: 'uppercase',
          color: getDifficultyColour(proposal.difficulty),
          background: 'var(--bg-elevated)',
          padding: '4px 8px',
          borderRadius: '2px',
          letterSpacing: '0.05em',
        }}>
          {proposal.difficulty}
        </span>
      </div>

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '28px',
        color: 'var(--text-primary)',
        lineHeight: 1.2,
        marginBottom: '16px',
      }}>
        {proposal.title}
      </h2>

      <p style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 400,
        fontSize: '16px',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        marginBottom: '24px',
      }}>
        {proposal.summary}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
      }}>
        <div>
          <h4 style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '14px',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '12px',
            letterSpacing: '0.05em',
          }}>
            For
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {proposal.forArguments.map((arg, i) => (
              <li key={i} style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '15px',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                marginBottom: '8px',
                paddingLeft: '12px',
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--text-muted)',
                }}>-</span>
                {arg}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '14px',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '12px',
            letterSpacing: '0.05em',
          }}>
            Against
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {proposal.againstArguments.map((arg, i) => (
              <li key={i} style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '15px',
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                marginBottom: '8px',
                paddingLeft: '12px',
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: 'var(--text-muted)',
                }}>-</span>
                {arg}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
