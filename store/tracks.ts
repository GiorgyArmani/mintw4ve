import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Track {
  id: string
  title: string
  description: string
  genre: string
  artist: string
  walletAddress: string
  coverUrl: string
  audioUrl: string
  metadataUri: string
  tokenId?: string
  plays: number
  earnings: string
  createdAt: string
}

interface TracksState {
  tracks: Track[]
  addTrack: (track: Track) => void
  getTrack: (id: string) => Track | undefined
  getUserTracks: (walletAddress: string) => Track[]
  incrementPlays: (id: string, earned: string) => void
}

/**
 * Zustand store for tracks
 * In-memory storage for MVP, can be synced with Supabase later
 */
export const useTracksStore = create<TracksState>()(
  persist(
    (set, get) => ({
      tracks: [],

      addTrack: (track) =>
        set((state) => ({
          tracks: [...state.tracks, track],
        })),

      getTrack: (id) => get().tracks.find((t) => t.id === id),

      getUserTracks: (walletAddress) => get().tracks.filter((t) => t.walletAddress === walletAddress),

      incrementPlays: (id, earned) =>
        set((state) => ({
          tracks: state.tracks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  plays: t.plays + 1,
                  earnings: (Number.parseFloat(t.earnings) + Number.parseFloat(earned)).toFixed(2),
                }
              : t,
          ),
        })),
    }),
    {
      name: "mintwave-tracks",
    },
  ),
)
