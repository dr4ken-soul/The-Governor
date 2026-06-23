import { useCallback } from 'react'
import { connectKeplr } from '../lib/keplr'
import { useGameStore } from '../store/useGameStore'

/**
 * Hook for managing Keplr wallet connection state.
 * Uses Zustand store for global connection state so all components share the same wallet status.
 * @returns Connection state, address, connect and disconnect functions
 */
export function useKeplr() {
  const player = useGameStore((s) => s.player)
  const setPlayer = useGameStore((s) => s.setPlayer)
  const connectionState = useGameStore((s) => s.connectionState)
  const setConnectionState = useGameStore((s) => s.setConnectionState)

  /**
   * Initiates the Keplr wallet connection.
   * On success, sets the player in the Zustand store with 100 ATOM starting balance.
   */
  const connect = useCallback(async () => {
    setConnectionState('connecting')

    try {
      const result = await connectKeplr()
      setConnectionState('connected')

      setPlayer({
        address: result.address,
        balance: 100,
        totalEarned: 0,
        totalVotes: 0,
        winRate: 0,
      })

      return result.address
    } catch (err) {
      console.error('Keplr connection failed:', err)
      setConnectionState('error')
      return null
    }
  }, [setPlayer, setConnectionState])

  /**
   * Disconnects the wallet and resets connection state.
   */
  const disconnect = useCallback(() => {
    setConnectionState('idle')
    setPlayer(null as any)
  }, [setConnectionState, setPlayer])

  return {
    connect,
    disconnect,
    address: player?.address ?? null,
    isConnected: connectionState === 'connected' && !!player,
    connectionState,
  }
}
