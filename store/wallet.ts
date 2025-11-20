import { create } from "zustand"
import { persist } from "zustand/middleware"

interface WalletState {
  mockWaveBalance: string
  increaseBalance: (amount: string) => void
  decreaseBalance: (amount: string) => void
  resetBalance: () => void
}

/**
 * Zustand store for wallet state
 * Manages mock $WAVE balance for testing
 */
export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      mockWaveBalance: "100.00", // Start with 100 WAVE for testing

      increaseBalance: (amount: string) =>
        set((state) => ({
          mockWaveBalance: (Number.parseFloat(state.mockWaveBalance) + Number.parseFloat(amount)).toFixed(2),
        })),

      decreaseBalance: (amount: string) =>
        set((state) => ({
          mockWaveBalance: Math.max(0, Number.parseFloat(state.mockWaveBalance) - Number.parseFloat(amount)).toFixed(2),
        })),

      resetBalance: () => set({ mockWaveBalance: "100.00" }),
    }),
    {
      name: "mintwave-wallet",
    },
  ),
)
