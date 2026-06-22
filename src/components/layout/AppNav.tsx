import { NavLink } from 'react-router-dom'
import { useGameStore } from '../../store/useGameStore'
import { shortenAddress } from '../../lib/keplr'

/**
 * App interior navigation bar.
 * Displays the wordmark and shortened wallet address on the left,
 * with four tab links on the right: Chamber, Proposals, Leaderboard, History.
 */
export function AppNav() {
  const player = useGameStore((s) => s.player)

  const tabs = [
    { label: 'Chamber', path: '/app/chamber' },
    { label: 'Proposals', path: '/app/proposals' },
    { label: 'Leaderboard', path: '/app/leaderboard' },
    { label: 'History', path: '/app/history' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
      height: '60px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* logo: swap plain text for <img src="/logo.svg" alt="The Governor" /> when file is provided */}
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '18px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          The Governor
        </span>
        {player && (
          <>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>·</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}>
              {shortenAddress(player.address)}
            </span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
