import { formatAtom } from '../../lib/utils'

interface StakeInputProps {
  value: number
  onChange: (value: number) => void
  maxBalance: number
  disabled?: boolean
}

/**
 * Stake amount input with balance display and validation.
 * Shows an error message if the stake exceeds the player's balance.
 * @param value - Current stake amount
 * @param onChange - Callback when stake amount changes
 * @param maxBalance - Maximum allowed stake (player's balance)
 * @param disabled - Whether the input is disabled
 */
export function StakeInput({ value, onChange, maxBalance, disabled = false }: StakeInputProps) {
  const isOverBalance = value > maxBalance

  return (
    <div>
      <label style={{
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        fontSize: '13px',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        display: 'block',
        marginBottom: '8px',
      }}>
        Stake amount
      </label>

      <div style={{ position: 'relative' }}>
        <input
          type="number"
          min={1}
          max={maxBalance}
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          placeholder="Enter ATOM amount"
          style={{
            width: '100%',
            background: 'var(--bg-elevated)',
            border: `1px solid ${isOverBalance ? '#c0392b' : 'var(--border-default)'}`,
            borderRadius: '2px',
            padding: '12px 16px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 400,
            fontSize: '16px',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
        />
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '8px',
      }}>
        <div>
          {isOverBalance && (
            <span style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '13px',
              color: '#c0392b',
            }}>
              Your stake cannot exceed your current balance
            </span>
          )}
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 400,
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}>
          Balance: {formatAtom(maxBalance)} ATOM
        </span>
      </div>
    </div>
  )
}
