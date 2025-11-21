import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Earning {
    id: string
    trackId: string
    artistWallet: string
    amount: number
    timestamp: number
    eventType: 'stream' | 'mint' | 'collab' | 'tip'
}

interface EarningsState {
    earnings: Earning[]
    totalEarned: number
    awardStreamEarnings: (trackId: string, artistWallet: string) => number
    awardMintEarnings: (trackId: string, artistWallet: string) => number
    awardCollabEarnings: (trackId: string, artistWallet: string, amount: number) => number
    getTotalEarnings: () => number
    getEarningsByTrack: (trackId: string) => Earning[]
    clearEarnings: () => void
}

const STREAM_REWARD = 0.1 // $MINT tokens per stream (after 30 seconds)
const MINT_REWARD = 10 // $MINT tokens for minting a track

export const useEarningsStore = create<EarningsState>()(
    persist(
        (set, get) => ({
            earnings: [],
            totalEarned: 0,

            /**
             * Award tokens for streaming a track (Listen2Earn)
             * Called after 30 seconds of playback
             */
            awardStreamEarnings: (trackId: string, artistWallet: string) => {
                const earning: Earning = {
                    id: `${trackId}-${Date.now()}`,
                    trackId,
                    artistWallet,
                    amount: STREAM_REWARD,
                    timestamp: Date.now(),
                    eventType: 'stream',
                }

                set((state) => ({
                    earnings: [...state.earnings, earning],
                    totalEarned: state.totalEarned + STREAM_REWARD,
                }))

                return STREAM_REWARD
            },

            /**
             * Award tokens for minting a track
             */
            awardMintEarnings: (trackId: string, artistWallet: string) => {
                const earning: Earning = {
                    id: `${trackId}-mint-${Date.now()}`,
                    trackId,
                    artistWallet,
                    amount: MINT_REWARD,
                    timestamp: Date.now(),
                    eventType: 'mint',
                }

                set((state) => ({
                    earnings: [...state.earnings, earning],
                    totalEarned: state.totalEarned + MINT_REWARD,
                }))

                return MINT_REWARD
            },

            /**
             * Award tokens for collaborations
             */
            awardCollabEarnings: (trackId: string, artistWallet: string, amount: number) => {
                const earning: Earning = {
                    id: `${trackId}-collab-${Date.now()}`,
                    trackId,
                    artistWallet,
                    amount,
                    timestamp: Date.now(),
                    eventType: 'collab',
                }

                set((state) => ({
                    earnings: [...state.earnings, earning],
                    totalEarned: state.totalEarned + amount,
                }))

                return amount
            },

            /**
             * Get total earnings across all events
             */
            getTotalEarnings: () => {
                return get().totalEarned
            },

            /**
             * Get earnings for a specific track
             */
            getEarningsByTrack: (trackId: string) => {
                return get().earnings.filter((e) => e.trackId === trackId)
            },

            /**
             * Clear all earnings (for testing/reset)
             */
            clearEarnings: () => {
                set({ earnings: [], totalEarned: 0 })
            },
        }),
        {
            name: 'mintwave-earnings',
        }
    )
)