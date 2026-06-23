import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useGameStore } from '../../store/useGameStore'
import { useKeplr } from '../../hooks/useKeplr'
import { shortenAddress } from '../../lib/keplr'
import { formatAtom } from '../../lib/utils'

/**
 * App interior navigation bar.
 * Displays the wordmark and clickable wallet address on the left (with dropdown),
 * with four tab links on the right: Chamber, Proposals, Leaderboard, History.
 */
export function AppNav() {
  const player = useGameStore((s) => s.player)
  const { disconnect, address } = useKeplr()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }} ref={dropdownRef}>
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
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'none',
                border: '1px solid var(--border-default)',
                borderRadius: '2px',
                padding: '4px 10px',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
            >
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#4caf78',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}>
                {shortenAddress(player.address)}
              </span>
            </button>

            {/* Wallet dropdown */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '44px',
                left: 0,
                width: '280px',
                background: 'linear-gradient(135deg, rgba(22, 20, 16, 0.98) 0%, rgba(30, 27, 21, 0.98) 100%)',
                border: '1px solid var(--border-default)',
                borderRadius: '2px',
                padding: '0',
                zIndex: 200,
                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                overflow: 'hidden',
              }}>
                {/* Header */}
                <div style={{
                  padding: '14px 16px 10px',
                  borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '6px',
                  }}>
                    Connected Wallet
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    wordBreak: 'break-all',
                    lineHeight: 1.4,
                  }}>
                    {address}
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: '10px 16px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 0',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                    }}>Network</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      fontWeight: 500,
                    }}>Cosmos Hub</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 0',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                    }}>Status</span>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: '#4caf78',
                      fontWeight: 600,
                    }}>Active</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 0',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--text-muted)',
                    }}>Balance</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      color: 'var(--accent)',
                      fontWeight: 700,
                    }}>{formatAtom(player.balance)} ATOM</span>
                  </div>
                </div>

                {/* Disconnect button */}
                <div style={{
                  padding: '8px 16px 14px',
                  borderTop: '1px solid var(--border-subtle)',
                }}>
                  <button
                    onClick={() => {
                      disconnect()
                      setShowDropdown(false)
                      navigate('/')
                    }}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-default)',
                      borderRadius: '2px',
                      padding: '8px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      fontSize: '13px',
                      transition: 'color 0.2s ease, border-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#c0392b'
                      e.currentTarget.style.borderColor = '#c0392b'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-muted)'
                      e.currentTarget.style.borderColor = 'var(--border-default)'
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}
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
