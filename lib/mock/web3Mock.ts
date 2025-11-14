/**
 * Mock Web3 Services for MVP Development
 *
 * These functions simulate blockchain interactions when NEXT_PUBLIC_WEB3_MODE=mock
 * Switch to real contract calls by setting NEXT_PUBLIC_WEB3_MODE=onchain
 */

export interface MockTrackMint {
  tokenId: string
  transactionHash: string
  metadataUri: string
}

export interface MockMintBalance {
  balance: string
  formatted: string
}

// Simulates minting a track NFT
export async function mockMintTrack(metadataUri: string, walletAddress: string): Promise<MockTrackMint> {
  // Simulate blockchain delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const tokenId = Math.floor(Math.random() * 1000000).toString()
  const transactionHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`

  return {
    tokenId,
    transactionHash,
    metadataUri,
  }
}

// Simulates getting $MINT token balance
export async function mockGetMintBalance(address: string): Promise<MockMintBalance> {
  // Return a random balance between 0-1000 MINT
  const balance = (Math.random() * 1000).toFixed(2)

  return {
    balance: (Number.parseFloat(balance) * 1e18).toString(), // Convert to wei
    formatted: balance,
  }
}

// Simulates awarding tokens for streaming
export async function mockAwardStreamEarnings(trackId: string, listenerAddress: string): Promise<{ earned: string }> {
  // Award between 0.1-1 MINT per stream
  const earned = (Math.random() * 0.9 + 0.1).toFixed(2)

  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { earned }
}

// Check if we're in mock mode
export function isWeb3MockMode(): boolean {
  return process.env.NEXT_PUBLIC_WEB3_MODE !== "onchain"
}
