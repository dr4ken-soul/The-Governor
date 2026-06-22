import { useState, useCallback } from 'react'
import { connectKeplr } from '../lib/keplr'
import { useGameStore } from '../store/useGameStore'

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error'

/**
 * Hook for managing Keplr wallet connection state.
 * Handles connecting, disconnecting and exposing the wallet address and connection status.
 * @returns Connection state, address, connect and disconnect functions
 */
export function useKeplr() {
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle')
  const [address, setAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const setPlayer = useGameStore((s) => s.setPlayer)

  /**
   * Initiates the Keplr wallet connection.
   * On success, sets the player in the Zustand store with 100 ATOM starting balance.
   */
  const connect = useCallback(async () => {
    setConnectionState('connecting')
    setError(null)

    try {
      const result = await connectKeplr()
      setAddress(result.address)
      setConnectionState('connected')

      setPlayer({
        address: result.address,
        balance: 100,
        totalEarned: 0,
        totalVotes: 0,
        winRate: 0,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not connect to Keplr. Make sure the extension is installed and try again'
      setError(message)
      setConnectionState('error')
    }
  }, [setPlayer])

  /**
   * Disconnects the wallet and resets connection state.
   */
  const disconnect = useCallback(() => {
    setAddress(null)
    setConnectionState('idle')
    setError(null)
  }, [])

  return {
    connect,
    disconnect,
    address,
    isConnected: connectionState === 'connected',
    connectionState,
    error,
  }
}
