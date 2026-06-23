import { create } from 'zustand'
import type { GameStore, Player, Proposal, Vote, ConnectionState } from '../types'

/**
 * Global game state store using Zustand.
 * Manages player state, proposals, votes, leaderboard, wallet connection and active proposal tracking.
 */
export const useGameStore = create<GameStore>((set) => ({
  player: null,
  proposals: [],
  votes: [],
  activeProposalId: null,
  leaderboard: [],
  connectionState: 'idle' as ConnectionState,

  /**
   * Sets the connected player in state or null to clear.
   * @param player - The player object with address and balance, or null
   */
  setPlayer: (player: Player | null) => set({ player }),

  /**
   * Sets the wallet connection state.
   * @param connectionState - The new connection state
   */
  setConnectionState: (connectionState: ConnectionState) => set({ connectionState }),

  /**
   * Adds a new proposal to the proposals list.
   * @param proposal - The proposal to add
   */
  addProposal: (proposal: Proposal) =>
    set((state) => ({ proposals: [proposal, ...state.proposals] })),

  /**
   * Records a vote and deducts the stake from the player's balance.
   * @param vote - The vote to record
   */
  castVote: (vote: Vote) =>
    set((state) => ({
      votes: [...state.votes, vote],
    })),

  /**
   * Updates the player's balance by adding the given amount.
   * Use negative values to deduct.
   * @param amount - The amount to add to the balance
   */
  updateBalance: (amount: number) =>
    set((state) => {
      if (!state.player) return state
      return {
        player: {
          ...state.player,
          balance: Math.max(0, state.player.balance + amount),
        },
      }
    }),

  /**
   * Sets the currently active proposal ID.
   * @param id - The proposal ID or null to clear
   */
  setActiveProposalId: (id: string | null) => set({ activeProposalId: id }),

  /**
   * Updates an existing proposal with partial data.
   * @param id - The proposal ID to update
   * @param updates - Partial proposal fields to merge
   */
  updateProposal: (id: string, updates: Partial<Proposal>) =>
    set((state) => ({
      proposals: state.proposals.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  /**
   * Adds a new entry to the leaderboard.
   * @param player - The player to add
   */
  addLeaderboardEntry: (player: Player) =>
    set((state) => ({
      leaderboard: [...state.leaderboard, player],
    })),

  /**
   * Updates an existing leaderboard entry or adds it if not present.
   * @param player - The player data to update
   */
  updateLeaderboard: (player: Player) =>
    set((state) => {
      const exists = state.leaderboard.find((p) => p.address === player.address)
      if (exists) {
        return {
          leaderboard: state.leaderboard.map((p) =>
            p.address === player.address ? player : p
          ),
        }
      }
      return { leaderboard: [...state.leaderboard, player] }
    }),
}))
