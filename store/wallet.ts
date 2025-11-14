import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WalletState {
  mockMintBalance: string
  addToBalance: (amount: string) => void
  resetBalance: () => void
}

/**
 * Zustand store for wallet-related state
 * Tracks mock $MINT balance when in mock mode
 */
export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      mockMintBalance: "100.00", // Start with 100 MINT for testing

      addToBalance: (amount: string) =>
        set((state) => ({
          mockMintBalance: (Number.parseFloat(state.mockMintBalance) + Number.parseFloat(amount)).toFixed(2),
        })),

      resetBalance: () => set({ mockMintBalance: "100.00" }),
    }),
    {
      name: "mintwave-wallet",
    },
  ),
)
