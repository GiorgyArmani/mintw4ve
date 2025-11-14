import { sepolia, mainnet } from "viem/chains"
import type { Chain } from "viem"

/**
 * MINTWAVE Chain Configuration
 *
 * Default: Sepolia testnet for MVP
 * To switch to mainnet or other L2s (Base, Arbitrum, Optimism):
 * 1. Import the desired chain from 'viem/chains'
 * 2. Update mintwaveChain export below
 * 3. Update NEXT_PUBLIC_DEFAULT_CHAIN in .env
 */

// For production, switch to mainnet or desired L2
export const mintwaveChain: Chain = sepolia

// Alternative chains (uncomment when ready):
// import { base, arbitrum, optimism } from 'viem/chains'
// export const mintwaveChain: Chain = mainnet
// export const mintwaveChain: Chain = base
// export const mintwaveChain: Chain = arbitrum

export const supportedChains = [sepolia, mainnet] as const

export const defaultChain = mintwaveChain
