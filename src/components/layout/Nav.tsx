import { useKeplr } from '../../hooks/useKeplr'

/**
 * Landing page navigation bar.
 * Displays the wordmark on the left and a Connect Wallet button on the right.
 * Fixed position with backdrop blur that activates on scroll.
 */
export function Nav() {
  const { connect, isConnected, connectionState } = useKeplr()

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
      padding: '16px 40px',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      background: 'rgba(11, 10, 8, 0.6)',
    }}>
      {/* logo: swap plain text for <img src="/logo.svg" alt="The Governor" /> when file is provided */}
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
          onClick={connect}
          disabled={connectionState === 'connecting'}
          style={{ fontSize: '14px', height: '40px', padding: '0 24px' }}
        >
          {connectionState === 'connecting' ? 'Connecting...' : 'Connect wallet'}
        </button>
      ) : (
        <a
          href="/app/chamber"
          className="btn-accent"
          style={{
            fontSize: '14px',
            height: '40px',
            padding: '0 24px',
            textDecoration: 'none',
          }}
        >
          Enter chamber
        </a>
      )}
    </nav>
  )
}
