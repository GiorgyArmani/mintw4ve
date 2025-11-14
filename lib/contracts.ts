/**
 * MINTWAVE Smart Contract Addresses
 *
 * These are placeholder addresses for the MVP.
 * Replace with actual deployed contract addresses when ready.
 */

export const CONTRACTS = {
  // ERC-20 $MINT token contract
  MINT_TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000" as `0x${string}`,

  // ERC-721 Track NFT contract
  TRACK_NFT_ADDRESS: "0x0000000000000000000000000000000000000000" as `0x${string}`,

  // Royalty engine for future payouts
  ROYALTY_ENGINE_ADDRESS: "0x0000000000000000000000000000000000000000" as `0x${string}`,
} as const

export type ContractAddresses = typeof CONTRACTS
