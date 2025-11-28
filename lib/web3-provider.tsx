"use client"

import type React from "react"

import { WagmiProvider } from "wagmi"
import { sepolia, mainnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"

const config = getDefaultConfig({
  appName: "MINTW4VE",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "placeholder",
  chains: [mainnet, sepolia],
  ssr: true,
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={mainnet}
          showRecentTransactions={true}
          theme={darkTheme({
            accentColor: '#00ff9d',
            accentColorForeground: 'black',
            borderRadius: 'medium',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
