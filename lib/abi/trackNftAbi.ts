/**
 * Minimal ERC-721 ABI for Track NFT interactions
 */
export const trackNftAbi = [
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "metadataURI", type: "string" },
    ],
    name: "mintTrack",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const
