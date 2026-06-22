import { motion } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { formatAtom } from '../lib/utils'
import { staggerContainer, staggerChild } from '../components/ui/FadeIn'

/**
 * History page showing the connected player's voting record.
 * Displays proposal title, vote option, stake amount, reward and net gain/loss.
 */
export function History() {
  const votes = useGameStore((s) => s.votes)
  const proposals = useGameStore((s) => s.proposals)
  const player = useGameStore((s) => s.player)

  const playerVotes = player
    ? votes
        .filter((v) => v.playerAddress === player.address)
        .sort((a, b) => b.castAt - a.castAt)
    : []

  /**
   * Returns the colour for the vote option.
   */
  const getOptionColour = (option: string): string => {
    switch (option) {
      case 'yes': return '#4caf78'
      case 'no': return '#c0392b'
      case 'abstain': return 'var(--text-muted)'
      case 'noWithVeto': return 'var(--accent-dim)'
      default: return 'var(--text-secondary)'
    }
  }

  if (playerVotes.length === 0) {
    return (
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '28px',
          color: 'var(--text-primary)',
          marginBottom: '24px',
        }}>
          History
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          fontSize: '15px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: '60px 0',
        }}>
          No votes recorded yet. Your history will appear here after your first vote.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '28px',
        color: 'var(--text-primary)',
        marginBottom: '24px',
      }}>
        History
      </h1>

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {playerVotes.map((vote) => {
            const proposal = proposals.find((p) => p.id === vote.proposalId)
            const netGain = vote.reward - vote.stakeAmount
            const netColour = netGain > 0 ? '#4caf78' : netGain < 0 ? '#c0392b' : 'var(--text-muted)'

            return (
              <motion.div
                key={`${vote.proposalId}-${vote.castAt}`}
                variants={staggerChild}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 100px 120px',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: '15px',
                    color: 'var(--text-primary)',
                  }}>
                    {proposal?.title || 'Unknown proposal'}
                  </div>
                </div>

                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: getOptionColour(vote.option),
                  textTransform: 'capitalize',
                }}>
                  {vote.option.replace(/([A-Z])/g, ' $1')}
                </span>

                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: 'var(--text-muted)',
                }}>
                  {formatAtom(vote.stakeAmount)} ATOM
                </span>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: netColour,
                  }}>
                    {netGain > 0 ? '+' : ''}{formatAtom(netGain)} ATOM
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                  }}>
                    Net gain
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
