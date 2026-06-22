import type { Proposal, Tally, VoteOption } from '../types'

/** TokenRouter API configuration (supports MiniMax-M3 for free) */
const API_KEY = import.meta.env.VITE_AI_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY || ''
const API_BASE_URL = import.meta.env.VITE_AI_BASE_URL || 'https://api.tokenrouter.com/v1'
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'MiniMax-M3'

const PROPOSAL_PROMPT = `
You are generating a Cosmos Hub governance proposal for a governance simulation game.

Return only valid JSON with no markdown, no backticks and no preamble.

The JSON must match this exact structure:
{
  "type": "parameterChange" | "communityPoolSpend" | "softwareUpgrade" | "text" | "ibcClientUpdate",
  "title": "string, under 12 words",
  "summary": "string, 2 to 3 sentences explaining what the proposal does",
  "forArguments": ["string", "string", "string"],
  "againstArguments": ["string", "string", "string"],
  "difficulty": "straightforward" | "contested" | "divisive"
}

Write in British English. No em dashes. Proposals must feel like real Cosmos Hub governance items.
Vary the types across calls. Make some proposals clearly beneficial, some clearly risky and some genuinely divisive.
`

/**
 * Builds the narration prompt for a closed proposal.
 * Instructs the AI to write exactly two paragraphs in British English.
 * @param proposal - The closed proposal object
 * @param tally - The final vote tally percentages
 * @param winner - The winning vote option
 * @returns The formatted prompt string
 */
function buildNarrationPrompt(proposal: Proposal, tally: Tally, winner: VoteOption): string {
  const total = tally.yes + tally.no + tally.abstain + tally.noWithVeto
  const yesPercent = total > 0 ? Math.round((tally.yes / total) * 100) : 0
  const noPercent = total > 0 ? Math.round((tally.no / total) * 100) : 0
  const abstainPercent = total > 0 ? Math.round((tally.abstain / total) * 100) : 0
  const vetoPercent = total > 0 ? Math.round((tally.noWithVeto / total) * 100) : 0

  return `
You are a Cosmos Hub political correspondent narrating the outcome of a governance vote.

Proposal: ${proposal.title}
Summary: ${proposal.summary}
Final tally: Yes ${yesPercent}% | No ${noPercent}% | Abstain ${abstainPercent}% | NoWithVeto ${vetoPercent}%
Outcome: ${winner}

Write exactly two paragraphs. The first explains why the majority voted as it did. The second explains what this outcome means for the Cosmos Hub.

Write in British English. No em dashes. No filler phrases. No markdown.
  `
}

/**
 * Calls the AI API using the OpenAI-compatible chat completions format.
 * Works with TokenRouter, OpenAI, MiniMax and any OpenAI-compatible provider.
 * @param prompt - The user prompt to send
 * @param maxTokens - Maximum tokens in the response
 * @returns The text content of the AI response
 */
async function callAI(prompt: string, maxTokens: number = 1000): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    }),
  })

  if (!response.ok) {
    throw new Error(`AI API returned status ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

/** Fallback proposals for when the AI API is unavailable */
const FALLBACK_PROPOSALS = [
  {
    type: 'parameterChange' as const,
    title: 'Reduce minimum deposit for governance proposals',
    summary: 'This proposal reduces the minimum deposit required to submit a governance proposal from 250 ATOM to 100 ATOM. The change would lower the barrier to entry for community participation in Hub governance.',
    forArguments: [
      'Lowers the barrier for smaller stakeholders to participate in governance',
      'Encourages more diverse proposals from the community',
      'The current minimum deposit excludes many active contributors'
    ],
    againstArguments: [
      'Could lead to spam proposals flooding the governance queue',
      'Reduces the economic disincentive for low-quality proposals',
      'The current threshold ensures proposers have meaningful skin in the game'
    ],
    difficulty: 'contested' as const,
  },
  {
    type: 'communityPoolSpend' as const,
    title: 'Fund Cosmos Hub developer education programme',
    summary: 'Allocating 50,000 ATOM from the community pool to establish a six-month developer education programme focused on Cosmos SDK and IBC protocol development. The programme would train 200 developers across three cohorts.',
    forArguments: [
      'Directly grows the pool of developers building on Cosmos Hub',
      'Education programmes have historically delivered strong returns for ecosystems',
      'The programme includes measurable outcomes and milestone-based funding'
    ],
    againstArguments: [
      '50,000 ATOM is a significant allocation with uncertain returns',
      'Similar programmes in other ecosystems have had mixed results',
      'The community pool should be preserved for more critical infrastructure needs'
    ],
    difficulty: 'straightforward' as const,
  },
  {
    type: 'softwareUpgrade' as const,
    title: 'Upgrade to Gaia v18 with IBC rate limiting',
    summary: 'This proposal triggers the upgrade to Gaia v18 which includes IBC rate limiting, improved slashing parameters and enhanced query performance. The upgrade requires a coordinated halt at block height 22,500,000.',
    forArguments: [
      'IBC rate limiting adds critical security protection against bridge exploits',
      'Performance improvements reduce validator operational overhead',
      'The upgrade has been thoroughly tested on multiple testnets'
    ],
    againstArguments: [
      'Coordinated upgrades carry inherent risk of chain halts',
      'Some validators may not be prepared for the upgrade timeline',
      'Rate limiting parameters may need further tuning post-upgrade'
    ],
    difficulty: 'straightforward' as const,
  },
  {
    type: 'text' as const,
    title: 'Signal support for Cosmos Hub minimal viable product philosophy',
    summary: 'A signalling proposal to affirm the community\'s commitment to the Cosmos Hub minimal viable product philosophy, where the Hub focuses on security, interchain staking and IBC routing rather than expanding into application-layer services.',
    forArguments: [
      'Keeps the Hub focused on its core value proposition as a security provider',
      'Prevents scope creep that could compromise chain stability',
      'Aligns with the original Cosmos Hub vision of a minimal secure base layer'
    ],
    againstArguments: [
      'Limits the Hub\'s ability to compete with feature-rich Layer 1 chains',
      'May reduce ATOM utility if the Hub does not expand its functionality',
      'The ecosystem has evolved beyond the original minimal vision'
    ],
    difficulty: 'divisive' as const,
  },
  {
    type: 'ibcClientUpdate' as const,
    title: 'Update Osmosis IBC client trust period',
    summary: 'Extends the IBC light client trust period for the Osmosis connection from 14 days to 21 days. This reduces the frequency of required client updates and lowers the risk of client expiry during periods of low relayer activity.',
    forArguments: [
      'Reduces operational burden on relayer operators',
      'The Osmosis connection is one of the most critical IBC channels',
      'A 21-day trust period is still well within safe bounds'
    ],
    againstArguments: [
      'Longer trust periods increase the window for potential security issues',
      'The current 14-day period has worked without client expiry',
      'Should be addressed through better relayer infrastructure rather than parameter changes'
    ],
    difficulty: 'straightforward' as const,
  },
]

/**
 * Generates a new Cosmos Hub governance proposal via the AI API.
 * Uses TokenRouter with MiniMax-M3 by default (free tier).
 * Falls back to pre-defined proposals if the API is unavailable or returns invalid data.
 * @returns A partial proposal object with type, title, summary, arguments and difficulty
 */
export async function generateProposal(): Promise<Pick<Proposal, 'type' | 'title' | 'summary' | 'forArguments' | 'againstArguments' | 'difficulty'>> {
  if (!API_KEY) {
    const index = Math.floor(Math.random() * FALLBACK_PROPOSALS.length)
    return FALLBACK_PROPOSALS[index]
  }

  try {
    const text = await callAI(PROPOSAL_PROMPT, 1000)

    // Extract JSON from the response (handle potential markdown wrapping)
    let jsonText = text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const parsed = JSON.parse(jsonText)

    if (!parsed.type || !parsed.title || !parsed.summary) {
      throw new Error('Invalid proposal structure returned by AI')
    }

    return parsed
  } catch (error) {
    console.warn('AI API unavailable, using fallback proposal:', error)
    const index = Math.floor(Math.random() * FALLBACK_PROPOSALS.length)
    return FALLBACK_PROPOSALS[index]
  }
}

/**
 * Generates a narration of the governance outcome via the AI API.
 * Falls back to a generic narration if the API is unavailable.
 * @param proposal - The closed proposal
 * @param tally - The final vote tally
 * @param winner - The winning vote option
 * @returns The narration as a plain string
 */
export async function generateNarration(proposal: Proposal, tally: Tally, winner: VoteOption): Promise<string> {
  if (!API_KEY) {
    return `The chamber has spoken. With a decisive ${winner} vote, the community has made its position clear on "${proposal.title}". The result reflects the current sentiment within the Cosmos Hub governance community.\n\nThis outcome will shape the direction of the Hub in the coming weeks. Validators and delegators alike will be watching closely to see how this decision plays out in practice.`
  }

  try {
    const prompt = buildNarrationPrompt(proposal, tally, winner)
    const text = await callAI(prompt, 500)
    return text
  } catch (error) {
    console.warn('AI narration API unavailable, using fallback:', error)
    return `The chamber has spoken. With a decisive ${winner} vote, the community has made its position clear on "${proposal.title}". The result reflects the current sentiment within the Cosmos Hub governance community.\n\nThis outcome will shape the direction of the Hub in the coming weeks. Validators and delegators alike will be watching closely to see how this decision plays out in practice.`
  }
}
