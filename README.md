# The Governor

A gamified Cosmos Hub governance simulator where players stake ATOM to vote on AI-generated proposals and earn rewards when they back the winning majority.

Built for the **Mad Easy on Cosmos** hackathon by Mad Scientists.

## How It Works

1. **Connect your Keplr wallet** and enter the governance chamber
2. **Read the AI-generated proposal** and decide your position
3. **Stake simulated ATOM** on your vote (Yes, No, Abstain or No With Veto)
4. **Watch the chamber fill up** as NPC voters cast their votes in real time
5. **Earn rewards** when the timer closes and your vote aligns with the majority

### Reward Structure

- **Majority vote (Yes/No):** 1.5x return on your stake
- **Abstain:** 1.0x (stake returned, no gain or loss)
- **No With Veto:** 0.5x (high-conviction option with reduced return)
- **Losing vote:** 0x (stake is lost)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Wallet | Keplr via window.keplr + @cosmjs/stargate |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| State | Zustand |
| Routing | React Router v6 |

## Setup

### Prerequisites

- Node.js 18+
- npm 9+
- Keplr browser extension (for wallet connection)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/the-governor.git
cd the-governor/governor
npm install
```

### Environment Variables

Copy the example file and add your API key:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_COSMOS_RPC=https://rpc.cosmos.network
VITE_CHAIN_ID=cosmoshub-4
```

The app works without a Claude API key using built-in fallback proposals.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.


### Build for Production

```bash
npm run build
```

## Project Structure

```
governor/
├── src/
│   ├── components/
│   │   ├── ui/            (FadeIn, SkeletonShimmer, CountdownTimer)
│   │   ├── layout/        (Nav, AppNav, AppLayout)
│   │   ├── chamber/       (ProposalCard, VoteTally, StakeInput, VoteButtons)
│   │   └── sections/      (Hero, StatsStrip, HowItWorks, Features, CosmosHub, CtaFooter)
│   ├── pages/             (Landing, Chamber, Proposals, Leaderboard, History)
│   ├── hooks/             (useKeplr, useProposal, useVoting)
│   ├── lib/               (claude, keplr, npcVoters, utils)
│   ├── store/             (useGameStore)
│   ├── types/             (TypeScript interfaces)
│   └── styles/            (globals.css)
├── .env.example
├── index.html
├── tailwind.config.js
└── vite.config.ts
```

## Cosmos Hub Connection

The Governor connects to Cosmos Hub mainnet via Keplr wallet on cosmoshub-4. Player identity is tied to their real Cosmos Hub wallet address. Every proposal Claude generates mirrors a real Cosmos Hub governance type: parameter changes, community pool spends, software upgrades, text proposals and IBC client updates. The game teaches players how Cosmos Hub governance works by giving them skin in the game through a risk and reward simulation built around ATOM.

## Features

- **AI Proposal Engine:** Claude generates realistic Cosmos Hub governance proposals covering parameter changes, community pool spends and protocol upgrades
- **Stake to Vote:** Players lock simulated ATOM and cast Yes, No, Abstain or No With Veto
- **Majority Alignment Rewards:** When voting closes, players who voted with the winning side receive a multiplied return
- **Live Governance Chamber:** Real-time tally with animated bars, countdown timer and total ATOM staked per option
- **AI Narration:** Claude narrates the political dynamics and delivers the outcome verdict
- **NPC Voter System:** Simulated voters create a living chamber with dynamic tallies
- **Leaderboard:** Track player rankings by total ATOM earned and win rate
- **Vote History:** Full record of every vote cast with rewards and net gains

## Hackathon

- **Project:** The Governor
- **Hackathon:** Mad Easy on Cosmos by Mad Scientists
- **Submission:** via Discord
- **Scoring:** Working prototype, Creative mechanic, AI usage, Cosmos relevance, Incentive clarity

## Licence

MIT
