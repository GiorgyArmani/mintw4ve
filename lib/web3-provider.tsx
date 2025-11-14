"use client"

import type React from "react"

import { WagmiProvider, createConfig, http } from "wagmi"
import { sepolia, mainnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider, getDefaultConfig } from "connectkit"

const config = createConfig(
  getDefaultConfig({
    // Your dApp info
    appName: "MINTWAVE",
    appDescription: "Mint your art. Ride your wave.",
    appUrl: "https://mintwave.app",
    appIcon: "/brand/mintwave-logo.svg",

    // WalletConnect project ID (get from https://cloud.walletconnect.com)
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "placeholder",

    chains: [sepolia, mainnet],
    transports: {
      [sepolia.id]: http(),
      [mainnet.id]: http(),
    },
  }),
)

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider theme="auto">{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
