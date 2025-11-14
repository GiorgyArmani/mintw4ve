/**
 * Storage Layer for Track Assets
 *
 * For MVP: Uses mock URLs
 * For Production: Integrate with IPFS via Web3.Storage, Pinata, or Vercel Blob
 */

export interface UploadTrackAssetsParams {
  audioFile: File
  coverFile?: File
  metadata: {
    title: string
    description: string
    genre: string
    artist: string
  }
}

export interface UploadTrackAssetsResult {
  metadataUri: string
  audioUrl: string
  coverUrl: string
}

/**
 * Uploads track assets and returns URLs
 *
 * TODO: Replace with actual IPFS/Blob storage implementation
 * Recommended: Use Vercel Blob or Web3.Storage
 */
export async function uploadTrackAssets(params: UploadTrackAssetsParams): Promise<UploadTrackAssetsResult> {
  const { audioFile, coverFile, metadata } = params

  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // For MVP: Return mock URLs
  // TODO: Implement actual upload to IPFS or Vercel Blob
  const mockCid = `Qm${Math.random().toString(36).substring(7)}`

  const audioUrl = `/placeholder.svg?height=400&width=400&query=audio+waveform`
  const coverUrl = coverFile
    ? `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(metadata.title)}+album+cover`
    : `/placeholder.svg?height=600&width=600&query=default+music+cover`

  // Create metadata JSON (following ERC-721 standard)
  const metadataJson = {
    name: metadata.title,
    description: metadata.description,
    image: coverUrl,
    animation_url: audioUrl,
    attributes: [
      { trait_type: "Artist", value: metadata.artist },
      { trait_type: "Genre", value: metadata.genre },
    ],
  }

  const metadataUri = `ipfs://${mockCid}/metadata.json`

  return {
    metadataUri,
    audioUrl,
    coverUrl,
  }
}

/**
 * Helper to convert IPFS URI to HTTP gateway URL
 */
export function ipfsToHttp(ipfsUri: string): string {
  if (ipfsUri.startsWith("ipfs://")) {
    return ipfsUri.replace("ipfs://", "https://ipfs.io/ipfs/")
  }
  return ipfsUri
}
