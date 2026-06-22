import { SigningStargateClient } from '@cosmjs/stargate'

declare global {
  interface Window {
    keplr?: {
      enable: (chainId: string) => Promise<void>
      getOfflineSigner: (chainId: string) => {
        getAccounts: () => Promise<{ address: string; pubkey: Uint8Array }[]>
      }
    }
  }
}

const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || 'cosmoshub-4'
const COSMOS_RPC = import.meta.env.VITE_COSMOS_RPC || 'https://rpc.cosmos.network'

/**
 * Connects the user's Keplr wallet to Cosmos Hub mainnet.
 * Enables cosmoshub-4 in Keplr, gets the offline signer and returns the address and signer.
 * @returns An object containing the wallet address and offline signer
 * @throws Error if Keplr is not installed
 */
export async function connectKeplr(): Promise<{ address: string; signer: ReturnType<NonNullable<Window['keplr']>['getOfflineSigner']> }> {
  if (!window.keplr) {
    throw new Error('Could not connect to Keplr. Make sure the extension is installed and try again')
  }

  await window.keplr.enable(CHAIN_ID)
  const offlineSigner = window.keplr.getOfflineSigner(CHAIN_ID)
  const accounts = await offlineSigner.getAccounts()

  return {
    address: accounts[0].address,
    signer: offlineSigner,
  }
}

/**
 * Queries the real ATOM balance of an address on cosmoshub-4 via the configured RPC endpoint.
 * Divides the uatom value by 1000000 to return the balance in ATOM.
 * @param address - The Cosmos Hub address to query
 * @returns The balance in ATOM as a number
 */
export async function getKeplrBalance(address: string): Promise<number> {
  try {
    const client = await SigningStargateClient.connect(COSMOS_RPC)
    const balance = await client.getBalance(address, 'uatom')
    return parseInt(balance.amount, 10) / 1_000_000
  } catch {
    return 0
  }
}

/**
 * Shortens a Cosmos address for display.
 * Returns the first 8 and last 6 characters separated by an ellipsis.
 * @param address - The full Cosmos address
 * @returns The shortened address string
 */
export function shortenAddress(address: string): string {
  if (address.length <= 14) return address
  return `${address.slice(0, 8)}...${address.slice(-6)}`
}
