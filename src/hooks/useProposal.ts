import { useState, useCallback } from 'react'
import { generateProposal as generateProposalApi } from '../lib/claude'
import { useGameStore } from '../store/useGameStore'
import { generateId } from '../lib/utils'
import type { Proposal } from '../types'

type ProposalState = 'idle' | 'generating' | 'ready' | 'error'

/**
 * Hook for managing AI proposal generation.
 * Calls the Claude API to generate proposals and stores them in the Zustand store.
 * @returns Generation state, current proposal, generate function and error
 */
export function useProposal() {
  const [state, setState] = useState<ProposalState>('idle')
  const [currentProposal, setCurrentProposal] = useState<Proposal | null>(null)
  const [error, setError] = useState<string | null>(null)
  const addProposal = useGameStore((s) => s.addProposal)
  const setActiveProposalId = useGameStore((s) => s.setActiveProposalId)

  /**
   * Generates a new proposal via the Claude API.
   * Sets createdAt to now and closesAt to 3 minutes from now.
   */
  const generate = useCallback(async () => {
    setState('generating')
    setError(null)

    try {
      const proposalData = await generateProposalApi()
      const now = Date.now()

      const proposal: Proposal = {
        id: generateId(),
        ...proposalData,
        createdAt: now,
        closesAt: now + 180_000, // 3 minutes
        status: 'active',
      }

      addProposal(proposal)
      setActiveProposalId(proposal.id)
      setCurrentProposal(proposal)
      setState('ready')

      return proposal
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not generate a proposal. Please try again'
      setError(message)
      setState('error')
      return null
    }
  }, [addProposal, setActiveProposalId])

  return {
    generate,
    currentProposal,
    isGenerating: state === 'generating',
    state,
    error,
  }
}
