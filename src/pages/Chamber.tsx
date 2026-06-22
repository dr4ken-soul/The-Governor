import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/useGameStore'
import { useProposal } from '../hooks/useProposal'
import { useVoting } from '../hooks/useVoting'
import { generateNarration } from '../lib/claude'
import { generateNpcVoters, tickNpcVotes, computeTallyWithNpcs } from '../lib/npcVoters'
import type { VoteOption, Tally, NpcVoter, NpcVote } from '../types'
import { ProposalCard } from '../components/chamber/ProposalCard'
import { VoteTally } from '../components/chamber/VoteTally'
import { StakeInput } from '../components/chamber/StakeInput'
import { VoteButtons } from '../components/chamber/VoteButtons'
import { CountdownTimer } from '../components/ui/CountdownTimer'
import { ProposalCardSkeleton } from '../components/ui/SkeletonShimmer'
import { delay } from '../lib/utils'

/**
 * Main chamber page orchestrating the full game loop.
 * Generates proposals, handles voting, runs NPC voters, calculates rewards and shows narration.
 */
export function Chamber() {
  const { generate, isGenerating } = useProposal()
  const { castVote, calculateReward } = useVoting()
  const player = useGameStore((s) => s.player)
  const proposals = useGameStore((s) => s.proposals)
  const votes = useGameStore((s) => s.votes)
  const activeProposalId = useGameStore((s) => s.activeProposalId)
  const updateProposal = useGameStore((s) => s.updateProposal)
  const updateBalance = useGameStore((s) => s.updateBalance)
  const updateLeaderboard = useGameStore((s) => s.updateLeaderboard)

  const [stakeAmount, setStakeAmount] = useState<number>(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [selectedOption, setSelectedOption] = useState<VoteOption | undefined>()
  const [tally, setTally] = useState<Tally>({ yes: 0, no: 0, abstain: 0, noWithVeto: 0 })
  const [npcVoters, setNpcVoters] = useState<NpcVoter[]>([])
  const [npcVotes, setNpcVotes] = useState<NpcVote[]>([])
  const [narration, setNarration] = useState<string | null>(null)
  const [roundOver, setRoundOver] = useState(false)
  const [winningOption, setWinningOption] = useState<VoteOption | null>(null)
  const [reward, setReward] = useState<number | null>(null)
  const hasExpiredRef = useRef(false)

  const activeProposal = proposals.find((p) => p.id === activeProposalId)

  /** Generates a new proposal if none is active */
  useEffect(() => {
    if (!activeProposalId && !isGenerating) {
      generate()
    }
  }, [activeProposalId, isGenerating, generate])

  /** Sets up NPC voters when a new proposal loads */
  useEffect(() => {
    if (activeProposal && activeProposal.status === 'active') {
      const voters = generateNpcVoters(activeProposal.id, activeProposal.difficulty)
      setNpcVoters(voters)
      setNpcVotes([])
      setHasVoted(false)
      setSelectedOption(undefined)
      setStakeAmount(0)
      setNarration(null)
      setRoundOver(false)
      setWinningOption(null)
      setReward(null)
      hasExpiredRef.current = false
    }
  }, [activeProposal?.id])

  /** Ticks NPC votes every 8 seconds */
  useEffect(() => {
    if (!activeProposal || activeProposal.status !== 'active') return

    const interval = setInterval(() => {
      const elapsed = Date.now() - activeProposal.createdAt
      const currentNpcVotes = tickNpcVotes(npcVoters, elapsed)
      setNpcVotes(currentNpcVotes)
    }, 3000)

    return () => clearInterval(interval)
  }, [activeProposal, npcVoters])

  /** Updates tally when votes change */
  useEffect(() => {
    const proposalVotes = votes.filter((v) => v.proposalId === activeProposalId)
    const newTally = computeTallyWithNpcs(proposalVotes, npcVotes)
    setTally(newTally)
  }, [votes, npcVotes, activeProposalId])

  /**
   * Handles voting on the active proposal.
   */
  const handleVote = useCallback((option: VoteOption) => {
    if (!activeProposal || hasVoted || stakeAmount < 1) return
    if (player && stakeAmount > player.balance) return

    const vote = castVote(activeProposal.id, option, stakeAmount)
    if (vote) {
      setHasVoted(true)
      setSelectedOption(option)
    }
  }, [activeProposal, hasVoted, stakeAmount, player, castVote])

  /**
   * Handles the timer expiring. Determines the winner, calculates rewards,
   * generates narration and sets up the next round.
   */
  const handleExpire = useCallback(async () => {
    if (!activeProposal || hasExpiredRef.current) return
    hasExpiredRef.current = true

    // Get final NPC votes
    const finalNpcVotes = tickNpcVotes(npcVoters, 180_000)
    setNpcVotes(finalNpcVotes)

    const proposalVotes = votes.filter((v) => v.proposalId === activeProposal.id)
    const finalTally = computeTallyWithNpcs(proposalVotes, finalNpcVotes)
    setTally(finalTally)

    // Determine winner
    const tallyEntries: [VoteOption, number][] = [
      ['yes', finalTally.yes],
      ['no', finalTally.no],
      ['abstain', finalTally.abstain],
      ['noWithVeto', finalTally.noWithVeto],
    ]
    tallyEntries.sort((a, b) => b[1] - a[1])
    const winner = tallyEntries[0][0]
    setWinningOption(winner)
    setRoundOver(true)

    // Calculate reward for the player
    if (hasVoted && selectedOption) {
      const rewardAmount = calculateReward(selectedOption, winner, stakeAmount)
      setReward(rewardAmount)
      updateBalance(rewardAmount)

      if (player) {
        const totalVotes = player.totalVotes + 1
        const won = selectedOption === winner || selectedOption === 'abstain'
        const totalWins = Math.round(player.winRate * player.totalVotes) + (won ? 1 : 0)

        updateLeaderboard({
          ...player,
          totalEarned: player.totalEarned + (rewardAmount - stakeAmount),
          totalVotes,
          winRate: totalVotes > 0 ? totalWins / totalVotes : 0,
          balance: player.balance + rewardAmount,
        })
      }
    }

    // Update proposal status
    updateProposal(activeProposal.id, {
      status: 'closed',
      winningOption: winner,
    })

    // Generate narration
    try {
      const narrationText = await generateNarration(activeProposal, finalTally, winner)
      setNarration(narrationText)
      updateProposal(activeProposal.id, { narration: narrationText })
    } catch {
      setNarration('The chamber has delivered its verdict.')
    }

    // Wait 10 seconds then generate new proposal
    await delay(10_000)
    generate()
  }, [activeProposal, npcVoters, votes, hasVoted, selectedOption, stakeAmount, player, calculateReward, updateBalance, updateLeaderboard, updateProposal, generate])

  if (isGenerating || !activeProposal) {
    return (
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '28px',
          color: 'var(--text-primary)',
          marginBottom: '24px',
        }}>
          The Chamber
        </h1>
        <ProposalCardSkeleton />
        <p style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          fontSize: '15px',
          color: 'var(--text-muted)',
          marginTop: '16px',
          textAlign: 'center',
        }}>
          No proposals yet. Generating a new one now
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '28px',
        color: 'var(--text-primary)',
        marginBottom: '24px',
      }}>
        The Chamber
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '32px',
        alignItems: 'start',
      }}>
        {/* Left column: Proposal */}
        <div>
          <ProposalCard proposal={activeProposal} />

          {/* AI Narration */}
          {narration && (
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="liquid-glass"
              style={{
                padding: '24px',
                marginTop: '24px',
                borderRadius: '2px',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '12px',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}>
                Chamber verdict
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '16px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}>
                {narration}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right column: Tally, Timer, Voting */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Countdown timer */}
          {!roundOver && (
            <div className="liquid-glass" style={{ padding: '20px', borderRadius: '2px' }}>
              <CountdownTimer
                closesAt={activeProposal.closesAt}
                onExpire={handleExpire}
              />
            </div>
          )}

          {/* Round result */}
          {roundOver && winningOption && (
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.4 }}
              className="liquid-glass-strong"
              style={{ padding: '20px', borderRadius: '2px', textAlign: 'center' }}
            >
              <div style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: '12px',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '8px',
              }}>
                Chamber closed
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '24px',
                color: 'var(--text-primary)',
                marginBottom: '8px',
              }}>
                {winningOption.charAt(0).toUpperCase() + winningOption.slice(1).replace(/([A-Z])/g, ' $1')} wins
              </div>
              {reward !== null && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '18px',
                  color: reward > stakeAmount ? '#4caf78' : reward < stakeAmount ? '#c0392b' : 'var(--text-muted)',
                }}>
                  {reward > stakeAmount ? '+' : ''}{(reward - stakeAmount).toFixed(2)} ATOM
                </div>
              )}
              <div style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: '13px',
                color: 'var(--text-muted)',
                marginTop: '8px',
              }}>
                New proposal generating in 10 seconds
              </div>
            </motion.div>
          )}

          {/* Vote tally */}
          <div className="liquid-glass" style={{ padding: '20px', borderRadius: '2px' }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '12px',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}>
              Total votes
            </div>
            <VoteTally tally={tally} />
          </div>

          {/* Stake and vote controls */}
          {!roundOver && (
            <div className="liquid-glass" style={{ padding: '20px', borderRadius: '2px' }}>
              {!hasVoted && (
                <div style={{ marginBottom: '16px' }}>
                  <StakeInput
                    value={stakeAmount}
                    onChange={setStakeAmount}
                    maxBalance={player?.balance ?? 0}
                    disabled={hasVoted}
                  />
                </div>
              )}
              <VoteButtons
                onVote={handleVote}
                disabled={hasVoted || stakeAmount < 1 || (player ? stakeAmount > player.balance : true)}
                hasVoted={hasVoted}
                selectedOption={selectedOption}
                stakeAmount={stakeAmount}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
