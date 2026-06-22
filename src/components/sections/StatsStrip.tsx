import { useGameStore } from '../../store/useGameStore'

/**
 * Stats strip section showing three key metrics.
 * Narrow horizontal band with active proposals, ATOM staked and players voting.
 */
export function StatsStrip() {
  const proposals = useGameStore((s) => s.proposals)
  const votes = useGameStore((s) => s.votes)

  const activeCount = proposals.filter((p) => p.status === 'active').length
  const totalStaked = votes.reduce((sum, v) => sum + v.stakeAmount, 0)
  const playerCount = new Set(votes.map((v) => v.playerAddress)).size

  const stats = [
    { label: 'Active proposals', value: activeCount },
    { label: 'ATOM staked', value: totalStaked },
    { label: 'Players voting', value: playerCount },
  ]

  return (
    <section style={{
      height: '80px',
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-default)',
      borderBottom: '1px solid var(--border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '80px',
    }}>
      {stats.map((stat) => (
        <div key={stat.label} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: '12px',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '4px',
          }}>
            {stat.label}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '28px',
            color: 'var(--accent)',
          }}>
            {stat.value}
          </div>
        </div>
      ))}
    </section>
  )
}
