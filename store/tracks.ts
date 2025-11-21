import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Track {
  id: string
  title: string
  artist: string
  displayName?: string
  description: string
  genre: string
  audioUrl: string
  coverUrl?: string
  metadataUri?: string
  tokenId?: number
  playCount?: number
  createdAt: string
  like_count?: number
  comment_count?: number
  tip_count?: number
  total_tips?: number
}

interface TracksState {
  tracks: Track[]
  isLoading: boolean
  lastFetched: number | null
  addTrack: (track: Track) => void
  fetchTracks: () => Promise<void>
  getTrackById: (id: string) => Track | undefined
  clearTracks: () => void
}

export const useTracksStore = create<TracksState>()(
  persist(
    (set, get) => ({
      tracks: [],
      isLoading: false,
      lastFetched: null,

      /**
       * Add a new track to the store
       */
      addTrack: (track: Track) => {
        set((state) => ({
          tracks: [track, ...state.tracks],
        }))
      },

      /**
       * Fetch tracks from API
       */
      fetchTracks: async () => {
        const state = get()

        // Cache for 5 minutes
        const now = Date.now()
        if (state.lastFetched && now - state.lastFetched < 5 * 60 * 1000) {
          return
        }

        set({ isLoading: true })

        try {
          const response = await fetch('/api/tracks')
          const data = await response.json()

          set({
            tracks: data.tracks || [],
            isLoading: false,
            lastFetched: now,
          })
        } catch (error) {
          console.error('Failed to fetch tracks:', error)
          set({ isLoading: false })
        }
      },

      /**
       * Get a specific track by ID
       */
      getTrackById: (id: string) => {
        return get().tracks.find((track) => track.id === id)
      },

      /**
       * Clear all tracks (for testing)
       */
      clearTracks: () => {
        set({ tracks: [], lastFetched: null })
      },
    }),
    {
      name: 'mintwave-tracks',
    }
  )
)