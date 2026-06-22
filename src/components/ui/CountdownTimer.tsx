import { useState, useEffect, useCallback } from 'react'

interface CountdownTimerProps {
  closesAt: number
  onExpire: () => void
}

/**
 * Countdown timer that displays time remaining in mm:ss format.
 * Turns accent colour when under 30 seconds remain.
 * Calls onExpire when the timer reaches zero.
 * @param closesAt - Timestamp when the voting window closes
 * @param onExpire - Callback fired when the timer reaches zero
 */
export function CountdownTimer({ closesAt, onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, closesAt - Date.now()))

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, closesAt - Date.now())
      setTimeLeft(remaining)

      if (remaining <= 0) {
        clearInterval(interval)
        onExpire()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [closesAt, onExpire])

  const isUrgent = timeLeft < 30_000
  const timerColour = isUrgent ? 'var(--accent)' : 'var(--text-primary)'

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 400,
        fontSize: '12px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '4px',
      }}>
        Time remaining
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        fontSize: '32px',
        color: timerColour,
        transition: 'color 0.3s ease',
      }}>
        {formatTime(timeLeft)}
      </div>
    </div>
  )
}
