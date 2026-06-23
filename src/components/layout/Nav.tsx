import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKeplr } from '../../hooks/useKeplr'
import { shortenAddress } from '../../lib/keplr'
import { formatAtom } from '../../lib/utils'
import { useGameStore } from '../../store/useGameStore'

/**
 * Landing page navigation bar.
 * Shows "Connect wallet" when disconnected.
 * After connecting, shows a connecting overlay, then redirects to /app/chamber.
 * When connected, shows a wallet button with a dropdown for details and disconnect.
 */
export function Nav() {
  const { connect, disconnect, isConnected, address, connectionState } = useKeplr()
  const player = useGameStore((s) => s.player)
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
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


  /**
   * Handles wallet connection with overlay transition.
   * Connects wallet, shows a brief overlay, then navigates to the chamber.
   */
  const handleConnect = async () => {
    setShowOverlay(true)
    const addr = await connect()
    if (addr) {
      // Brief pause to show the connecting state
      await new Promise((r) => setTimeout(r, 1200))
      setShowOverlay(false)
      navigate('/app/chamber')
    } else {
      setShowOverlay(false)
    }
  }

  return (
    <>
      {/* Connection overlay */}
      {showOverlay && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(11, 10, 8, 0.92)',
          backdropFilter: 'blur(20px)',
          animation: 'fadeIn 0.3s ease forwards',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '3px solid var(--border-default)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 20px',
            }} />
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '20px',
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              {connectionState === 'connecting' ? 'Connecting wallet...' : 'Opening chamber...'}
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--text-muted)',
            }}>
              Confirm the connection in your Keplr extension
            </div>
          </div>
        </div>
      )}

      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 40px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(11, 10, 8, 0.6)',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '20px',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          The Governor
        </span>

        {!isConnected ? (
          <button
            className="btn-accent"
            onClick={handleConnect}
            disabled={connectionState === 'connecting'}
            style={{ fontSize: '14px', height: '40px', padding: '0 24px' }}
          >
            {connectionState === 'connecting' ? 'Connecting...' : 'Connect wallet'}
          </button>
        ) : (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: '2px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                height: '40px',
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4caf78',
                flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--text-primary)',
              }}>
                {shortenAddress(address || '')}
              </span>
            </button>

            {/* Wallet dropdown */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: 0,
                width: '260px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '2px',
                padding: '16px',
                zIndex: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '8px',
                }}>
                  Connected wallet
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                  wordBreak: 'break-all',
                }}>
                  {address}
                </div>

                {player && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderTop: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '12px',
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
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      navigate('/app/chamber')
                    }}
                    style={{
                      flex: 1,
                      background: 'var(--accent)',
                      color: 'var(--bg-primary)',
                      border: 'none',
                      borderRadius: '2px',
                      padding: '8px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    Enter chamber
                  </button>
                  <button
                    onClick={() => {
                      disconnect()
                      setShowDropdown(false)
                    }}
                    style={{
                      background: 'transparent',
                      color: '#c0392b',
                      border: '1px solid #c0392b',
                      borderRadius: '2px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 500,
                      fontSize: '13px',
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
