import { motion } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { staggerContainer, staggerChild } from '../components/ui/FadeIn'

/**
 * Proposals page showing a grid of all past and active proposals.
 * Each card shows title, type badge, status badge, winning option and player's vote.
 */
export function Proposals() {
  const proposals = useGameStore((s) => s.proposals)
  const votes = useGameStore((s) => s.votes)
  const player = useGameStore((s) => s.player)

  /**
   * Formats the proposal type for display.
   */
  const formatType = (type: string): string => {
    return type.replace(/([A-Z])/g, ' $1').trim().toUpperCase()
  }

  /**
   * Returns the vote option colour.
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

  const sortedProposals = [...proposals].sort((a, b) => b.createdAt - a.createdAt)

  if (proposals.length === 0) {
    return (
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '28px',
          color: 'var(--text-primary)',
          marginBottom: '24px',
        }}>
          Proposals
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          fontSize: '15px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: '60px 0',
        }}>
          No proposals yet. Head to the chamber to start the first round.
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
        Proposals
      </h1>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
        }}
      >
        {sortedProposals.map((proposal) => {
          const playerVote = player
            ? votes.find((v) => v.proposalId === proposal.id && v.playerAddress === player.address)
            : null

          return (
            <motion.div
              key={proposal.id}
              variants={staggerChild}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="liquid-glass feature-card"
              style={{
                padding: '24px',
                borderRadius: '2px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
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
                  color: proposal.status === 'active' ? 'var(--accent)' : 'var(--text-muted)',
                  background: 'var(--bg-elevated)',
                  padding: '4px 8px',
                  borderRadius: '2px',
                  letterSpacing: '0.05em',
                }}>
                  {proposal.status}
                </span>
              </div>

              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '16px',
                color: 'var(--text-primary)',
                marginBottom: '8px',
                lineHeight: 1.3,
              }}>
                {proposal.title}
              </h3>

              {proposal.winningOption && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px',
                }}>
                  Result: <span style={{ color: getOptionColour(proposal.winningOption) }}>
                    {proposal.winningOption}
                  </span>
                </div>
              )}

              {playerVote && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 400,
                  fontSize: '13px',
                  color: getOptionColour(playerVote.option),
                }}>
                  Your vote: {playerVote.option}
                </div>
              )}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
