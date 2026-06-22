import { motion } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { shortenAddress } from '../lib/keplr'
import { formatAtom } from '../lib/utils'
import { staggerContainer, staggerChild } from '../components/ui/FadeIn'

/**
 * Leaderboard page showing player rankings by total ATOM earned.
 * Highlights the connected player's row.
 */
export function Leaderboard() {
  const leaderboard = useGameStore((s) => s.leaderboard)
  const player = useGameStore((s) => s.player)

  const sorted = [...leaderboard].sort((a, b) => b.totalEarned - a.totalEarned)

  if (sorted.length === 0) {
    return (
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '28px',
          color: 'var(--text-primary)',
          marginBottom: '24px',
        }}>
          Leaderboard
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          fontSize: '15px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: '60px 0',
        }}>
          No players ranked yet. Cast your first vote in the chamber.
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
        Leaderboard
      </h1>

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '60px 1fr 140px 100px 100px',
          gap: '16px',
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          {['Rank', 'Address', 'Total earned', 'Votes', 'Win rate'].map((header) => (
            <span key={header} style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '12px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}>
              {header}
            </span>
          ))}
        </div>

        {/* Rows */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate">
          {sorted.map((entry, index) => {
            const isCurrentPlayer = player?.address === entry.address
            const rank = index + 1

            return (
              <motion.div
                key={entry.address}
                variants={staggerChild}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 140px 100px 100px',
                  gap: '16px',
                  padding: '14px 20px',
                  background: isCurrentPlayer ? 'var(--bg-elevated)' : 'transparent',
                  border: isCurrentPlayer ? '1px solid var(--border-default)' : 'none',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '15px',
                  color: rank <= 3 ? 'var(--accent)' : 'var(--text-muted)',
                }}>
                  {rank}
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                }}>
                  {shortenAddress(entry.address)}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 400,
                  fontSize: '15px',
                  color: entry.totalEarned >= 0 ? '#4caf78' : '#c0392b',
                }}>
                  {entry.totalEarned >= 0 ? '+' : ''}{formatAtom(entry.totalEarned)} ATOM
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 400,
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                }}>
                  {entry.totalVotes}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 400,
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                }}>
                  {Math.round(entry.winRate * 100)}%
                </span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
