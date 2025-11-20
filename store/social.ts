import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Profile } from "@/lib/supabase/social"

/**
 * Social state management for MINTWAVE
 * Tracks current user's social interactions and cached data
 */

interface SocialState {
    // Current user's profile
    currentProfile: Profile | null
    setCurrentProfile: (profile: Profile | null) => void

    // Following state
    followingIds: Set<string>
    addFollowing: (userId: string) => void
    removeFollowing: (userId: string) => void
    isFollowing: (userId: string) => boolean
    setFollowing: (userIds: string[]) => void

    // Liked tracks
    likedTrackIds: Set<string>
    addLikedTrack: (trackId: string) => void
    removeLikedTrack: (trackId: string) => void
    isTrackLiked: (trackId: string) => boolean
    setLikedTracks: (trackIds: string[]) => void

    // Reset state
    reset: () => void
}

export const useSocialStore = create<SocialState>()(
    persist(
        (set, get) => ({
            currentProfile: null,
            followingIds: new Set(),
            likedTrackIds: new Set(),

            setCurrentProfile: (profile) => set({ currentProfile: profile }),

            addFollowing: (userId) =>
                set((state) => ({
                    followingIds: new Set([...state.followingIds, userId]),
                })),

            removeFollowing: (userId) =>
                set((state) => {
                    const newSet = new Set(state.followingIds)
                    newSet.delete(userId)
                    return { followingIds: newSet }
                }),

            isFollowing: (userId) => get().followingIds.has(userId),

            setFollowing: (userIds) =>
                set({
                    followingIds: new Set(userIds),
                }),

            addLikedTrack: (trackId) =>
                set((state) => ({
                    likedTrackIds: new Set([...state.likedTrackIds, trackId]),
                })),

            removeLikedTrack: (trackId) =>
                set((state) => {
                    const newSet = new Set(state.likedTrackIds)
                    newSet.delete(trackId)
                    return { likedTrackIds: newSet }
                }),

            isTrackLiked: (trackId) => get().likedTrackIds.has(trackId),

            setLikedTracks: (trackIds) =>
                set({
                    likedTrackIds: new Set(trackIds),
                }),

            reset: () =>
                set({
                    currentProfile: null,
                    followingIds: new Set(),
                    likedTrackIds: new Set(),
                }),
        }),
        {
            name: "mintwave-social",
            // Custom serialization for Sets
            partialize: (state) => ({
                currentProfile: state.currentProfile,
                followingIds: Array.from(state.followingIds),
                likedTrackIds: Array.from(state.likedTrackIds),
            }),
            // Custom deserialization for Sets
            merge: (persistedState: any, currentState) => ({
                ...currentState,
                ...persistedState,
                followingIds: new Set(persistedState.followingIds || []),
                likedTrackIds: new Set(persistedState.likedTrackIds || []),
            }),
        },
    ),
)
