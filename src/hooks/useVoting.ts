import { useCallback } from 'react'
import { useGameStore } from '../store/useGameStore'
import type { VoteOption, Vote } from '../types'

/**
 * Hook for managing the voting mechanic.
 * Handles vote casting, stake validation and reward calculation.
 * @returns castVote and calculateReward functions
 */
export function useVoting() {
  const player = useGameStore((s) => s.player)
  const castVoteToStore = useGameStore((s) => s.castVote)
  const updateBalance = useGameStore((s) => s.updateBalance)

  /**
   * Casts a vote on a proposal with the specified stake amount.
   * Validates the stake does not exceed the player's balance and deducts it.
   * @param proposalId - The proposal to vote on
   * @param option - The vote option
   * @param stakeAmount - The amount of ATOM to stake
   * @returns The vote object if successful, null otherwise
   */
  const castVote = useCallback(
    (proposalId: string, option: VoteOption, stakeAmount: number): Vote | null => {
      if (!player) return null
      if (stakeAmount > player.balance) return null
      if (stakeAmount < 1) return null

      updateBalance(-stakeAmount)

      const vote: Vote = {
        proposalId,
        playerAddress: player.address,
        option,
        stakeAmount,
        reward: 0,
        castAt: Date.now(),
      }

      castVoteToStore(vote)
      return vote
    },
    [player, castVoteToStore, updateBalance]
  )

  /**
   * Calculates the reward for a vote based on the outcome.
   * 1.5x if the option matches the winner, 1.0x if abstain, 0.5x if noWithVeto, 0x otherwise.
   * @param option - The player's vote option
   * @param winner - The winning vote option
   * @param stakeAmount - The amount staked
   * @returns The reward amount
   */
  const calculateReward = useCallback(
    (option: VoteOption, winner: VoteOption, stakeAmount: number): number => {
      if (option === 'abstain') return stakeAmount * 1.0
      if (option === 'noWithVeto') return stakeAmount * 0.5
      if (option === winner) return stakeAmount * 1.5
      return 0
    },
    []
  )

  return {
    castVote,
    calculateReward,
  }
}
