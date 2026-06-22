import { Outlet, Navigate } from 'react-router-dom'
import { AppNav } from './AppNav'
import { useGameStore } from '../../store/useGameStore'

/**
 * Layout wrapper for the app interior pages.
 * Includes the AppNav, CRT scanline overlay and routes guard.
 * Redirects to landing page if no player is connected.
 */
export function AppLayout() {
  const player = useGameStore((s) => s.player)

  if (!player) {
    return <Navigate to="/" replace />
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <div className="crt-overlay" />
      <AppNav />
      <main style={{ paddingTop: '80px', paddingBottom: '40px', maxWidth: '1200px', margin: '0 auto', padding: '80px 40px 40px' }}>
        <Outlet />
      </main>
    </div>
  )
}
