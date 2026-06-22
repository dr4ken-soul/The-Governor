import type { Vote, Tally, VoteOption, Difficulty } from '../types'
import { seededRandom } from './utils'

/** An NPC voter in the governance simulation */
export interface NpcVoter {
  address: string
  balance: number
  preferredOption: VoteOption
  voteTime: number
}

/** An NPC vote record */
export interface NpcVote {
  voterAddress: string
  option: VoteOption
  stakeAmount: number
}

/**
 * Generates a fake Cosmos Hub address from a seed value.
 * @param seed - Seed number for deterministic generation
 * @returns A fake cosmos1... address
 */
function generateFakeAddress(seed: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let addr = 'cosmos1'
  let hash = seed
  for (let i = 0; i < 38; i++) {
    hash = (hash * 16807 + i) % 2147483647
    addr += chars[Math.abs(hash) % chars.length]
  }
  return addr
}

/**
 * Determines the vote option distribution weights based on proposal difficulty.
 * Straightforward proposals lean towards yes, divisive ones spread evenly.
 * @param difficulty - The proposal difficulty rating
 * @returns An array of [option, weight] tuples
 */
function getOptionWeights(difficulty: Difficulty): [VoteOption, number][] {
  switch (difficulty) {
    case 'straightforward':
      return [['yes', 55], ['no', 20], ['abstain', 15], ['noWithVeto', 10]]
    case 'contested':
      return [['yes', 35], ['no', 35], ['abstain', 20], ['noWithVeto', 10]]
    case 'divisive':
      return [['yes', 28], ['no', 28], ['abstain', 22], ['noWithVeto', 22]]
  }
}

/**
 * Selects a vote option based on weighted probabilities using the seeded random function.
 * @param weights - Array of [option, weight] tuples
 * @param rand - Seeded random function
 * @returns The selected vote option
 */
function weightedSelect(weights: [VoteOption, number][], rand: () => number): VoteOption {
  const total = weights.reduce((sum, [, w]) => sum + w, 0)
  let r = rand() * total
  for (const [option, weight] of weights) {
    r -= weight
    if (r <= 0) return option
  }
  return weights[weights.length - 1][0]
}

/**
 * Generates NPC voters deterministically based on the proposal ID.
 * Creates between 8 and 20 NPC voters with randomised addresses, balances and preferred vote options
 * weighted by the proposal's difficulty rating.
 * @param proposalId - The proposal ID used as seed for deterministic generation
 * @param difficulty - The proposal difficulty affecting vote distribution
 * @returns An array of NPC voter objects
 */
export function generateNpcVoters(proposalId: string, difficulty: Difficulty): NpcVoter[] {
  const rand = seededRandom(proposalId)
  const count = Math.floor(rand() * 13) + 8 // 8 to 20

  const weights = getOptionWeights(difficulty)
  const votingWindowMs = 180_000 // 3 minutes

  const voters: NpcVoter[] = []
  for (let i = 0; i < count; i++) {
    const balance = Math.floor(rand() * 76) + 5 // 5 to 80 ATOM
    const preferredOption = weightedSelect(weights, rand)
    const voteTime = Math.floor(rand() * (votingWindowMs - 10_000)) + 5_000 // vote between 5s and 170s

    voters.push({
      address: generateFakeAddress(i + proposalId.charCodeAt(0) * 1000),
      balance,
      preferredOption,
      voteTime,
    })
  }

  return voters.sort((a, b) => a.voteTime - b.voteTime)
}

/**
 * Returns the subset of NPC voters who have voted by the given elapsed time.
 * Uses each voter's predetermined vote timing for reproducible results.
 * @param voters - The full list of NPC voters
 * @param elapsed - Time elapsed since the proposal opened in milliseconds
 * @returns An array of NPC votes that have been cast by this tick
 */
export function tickNpcVotes(voters: NpcVoter[], elapsed: number): NpcVote[] {
  return voters
    .filter((voter) => voter.voteTime <= elapsed)
    .map((voter) => ({
      voterAddress: voter.address,
      option: voter.preferredOption,
      stakeAmount: Math.floor(voter.balance * 0.6) + 1, // stake roughly 60% of balance
    }))
}

/**
 * Merges real player votes and NPC votes into a single tally showing total ATOM staked per option.
 * @param votes - Real player votes
 * @param npcVotes - NPC votes
 * @returns A tally object with ATOM staked per option
 */
export function computeTallyWithNpcs(votes: Vote[], npcVotes: NpcVote[]): Tally {
  const tally: Tally = { yes: 0, no: 0, abstain: 0, noWithVeto: 0 }

  for (const vote of votes) {
    tally[vote.option] += vote.stakeAmount
  }

  for (const npcVote of npcVotes) {
    tally[npcVote.option] += npcVote.stakeAmount
  }

  return tally
}
