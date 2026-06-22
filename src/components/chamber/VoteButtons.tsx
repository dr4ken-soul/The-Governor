import { motion } from 'framer-motion'
import type { VoteOption } from '../../types'
import { formatAtom } from '../../lib/utils'

interface VoteButtonsProps {
  onVote: (option: VoteOption) => void
  disabled: boolean
  hasVoted: boolean
  selectedOption?: VoteOption
  stakeAmount?: number
}

const voteOptions: { option: VoteOption; label: string; cssClass: string }[] = [
  { option: 'yes', label: 'Yes', cssClass: 'vote-btn-yes' },
  { option: 'no', label: 'No', cssClass: 'vote-btn-no' },
  { option: 'abstain', label: 'Abstain', cssClass: 'vote-btn-abstain' },
  { option: 'noWithVeto', label: 'No With Veto', cssClass: 'vote-btn-veto' },
]

/**
 * Vote buttons in a 2x2 grid.
 * Displays the four vote options with colour-coded hover states.
 * Switches to a confirmation state after the player has voted.
 * @param onVote - Callback when a vote option is selected
 * @param disabled - Whether buttons are disabled
 * @param hasVoted - Whether the player has already voted
 * @param selectedOption - The option the player selected
 * @param stakeAmount - The amount staked on the vote
 */
export function VoteButtons({ onVote, disabled, hasVoted, selectedOption, stakeAmount }: VoteButtonsProps) {
  if (hasVoted && selectedOption) {
    return (
      <motion.div
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.4 }}
        className="liquid-glass"
        style={{
          padding: '20px',
          borderRadius: '2px',
          textAlign: 'center',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: '14px',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '8px',
        }}>
          Vote confirmed
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 500,
          fontSize: '16px',
          color: 'var(--text-primary)',
        }}>
          {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1).replace(/([A-Z])/g, ' $1')}
          {stakeAmount !== undefined && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 400,
              fontSize: '14px',
              color: 'var(--text-secondary)',
              marginLeft: '8px',
            }}>
              ({formatAtom(stakeAmount)} ATOM)
            </span>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    }}>
      {voteOptions.map((vo) => (
        <button
          key={vo.option}
          className={`vote-btn ${vo.cssClass}`}
          onClick={() => onVote(vo.option)}
          disabled={disabled}
        >
          {vo.label}
        </button>
      ))}
    </div>
  )
}
