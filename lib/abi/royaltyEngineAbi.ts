/**
 * Minimal Royalty Engine ABI for future payout distribution
 */
export const royaltyEngineAbi = [
  {
    inputs: [{ name: "trackId", type: "uint256" }],
    name: "getPayouts",
    outputs: [
      { name: "recipients", type: "address[]" },
      { name: "amounts", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const
