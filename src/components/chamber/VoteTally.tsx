import { motion } from 'framer-motion'
import type { Tally } from '../../types'
import { formatAtom } from '../../lib/utils'

interface VoteTallyProps {
  tally: Tally
}

const options = [
  { key: 'yes' as const, label: 'Yes', colour: '#4caf78' },
  { key: 'no' as const, label: 'No', colour: '#c0392b' },
  { key: 'abstain' as const, label: 'Abstain', colour: 'var(--text-muted)' },
  { key: 'noWithVeto' as const, label: 'No With Veto', colour: 'var(--accent-dim)' },
]

/**
 * Displays the vote tally with four animated horizontal bars.
 * Each bar shows the option label, fill percentage and ATOM amount.
 * @param tally - The current vote tally with ATOM staked per option
 */
export function VoteTally({ tally }: VoteTallyProps) {
  const total = tally.yes + tally.no + tally.abstain + tally.noWithVeto

  /**
   * Calculates the percentage for a given option.
   */
  const getPercentage = (value: number): number => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {options.map((option) => {
          const value = tally[option.key]
          const percentage = getPercentage(value)

          return (
            <div key={option.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 400,
                fontSize: '13px',
                color: 'var(--text-secondary)',
                width: '120px',
                flexShrink: 0,
              }}>
                {option.label}
              </span>

              <div style={{
                flex: 1,
                height: '24px',
                background: 'var(--bg-elevated)',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: option.colour,
                    borderRadius: '2px',
                    opacity: 0.8,
                  }}
                />
              </div>

              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                fontSize: '14px',
                color: 'var(--text-primary)',
                width: '45px',
                textAlign: 'right',
                flexShrink: 0,
              }}>
                {percentage}%
              </span>
            </div>
          )
        })}
      </div>

      <div style={{
        marginTop: '12px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 400,
        fontSize: '13px',
        color: 'var(--text-muted)',
        textAlign: 'right',
      }}>
        Total staked: {formatAtom(total)} ATOM
      </div>
    </div>
  )
}
