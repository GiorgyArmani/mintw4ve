import { createClient } from "./client"

/**
 * Social features helper functions for MINTWAVE
 * Handles profiles, follows, likes, comments, and tips
 */

// ============================================================================
// PROFILE FUNCTIONS
// ============================================================================

export interface Profile {
    id: string
    username: string
    wallet_address: string
    display_name?: string
    bio?: string
    avatar_url?: string
    cover_image_url?: string
    is_artist: boolean
    genres?: string[]
    social_links?: Record<string, string>
    created_at: string
    updated_at: string
}

export async function getProfile(userId: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
        console.error("Error fetching profile:", error)
        return null
    }

    return data
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase.from("profiles").select("*").eq("username", username).single()

    if (error) {
        console.error("Error fetching profile by username:", error)
        return null
    }

    return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    const supabase = createClient()
    const { error } = await supabase.from("profiles").update(updates).eq("id", userId)

    if (error) {
        console.error("Error updating profile:", error)
        return false
    }

    return true
}

export async function createProfile(profile: Omit<Profile, "created_at" | "updated_at">): Promise<boolean> {
    const supabase = createClient()
    const { error } = await supabase.from("profiles").insert(profile)

    if (error) {
        console.error("Error creating profile:", error)
        return false
    }

    return true
}

// ============================================================================
// FOLLOW FUNCTIONS
// ============================================================================

export async function followUser(followingId: string): Promise<boolean> {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { error } = await supabase.from("follows").insert({
        follower_id: user.id,
        following_id: followingId,
    })

    if (error) {
        console.error("Error following user:", error)
        return false
    }

    return true
}

export async function unfollowUser(followingId: string): Promise<boolean> {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", followingId)

    if (error) {
        console.error("Error unfollowing user:", error)
        return false
    }

    return true
}

export async function isFollowing(userId: string, targetId: string): Promise<boolean> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", userId)
        .eq("following_id", targetId)
        .single()

    if (error) return false
    return !!data
}

export async function getFollowers(userId: string): Promise<Profile[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("follows")
        .select("follower:profiles!follower_id(*)")
        .eq("following_id", userId)

    if (error) {
        console.error("Error fetching followers:", error)
        return []
    }

    return data.map((item: any) => item.follower)
}

export async function getFollowing(userId: string): Promise<Profile[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("follows")
        .select("following:profiles!following_id(*)")
        .eq("follower_id", userId)

    if (error) {
        console.error("Error fetching following:", error)
        return []
    }

    return data.map((item: any) => item.following)
}

export async function getFollowerCount(userId: string): Promise<number> {
    const supabase = createClient()
    const { count, error } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId)

    if (error) {
        console.error("Error fetching follower count:", error)
        return 0
    }

    return count || 0
}

export async function getFollowingCount(userId: string): Promise<number> {
    const supabase = createClient()
    const { count, error } = await supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId)

    if (error) {
        console.error("Error fetching following count:", error)
        return 0
    }

    return count || 0
}

// ============================================================================
// LIKE FUNCTIONS
// ============================================================================

export async function likeTrack(trackId: string): Promise<boolean> {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { error } = await supabase.from("likes").insert({
        user_id: user.id,
        track_id: trackId,
    })

    if (error) {
        console.error("Error liking track:", error)
        return false
    }

    return true
}

export async function unlikeTrack(trackId: string): Promise<boolean> {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { error } = await supabase.from("likes").delete().eq("user_id", user.id).eq("track_id", trackId)

    if (error) {
        console.error("Error unliking track:", error)
        return false
    }

    return true
}

export async function isTrackLiked(trackId: string): Promise<boolean> {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return false

    const { data, error } = await supabase.from("likes").select("*").eq("user_id", user.id).eq("track_id", trackId).single()

    if (error) return false
    return !!data
}

export async function getTrackLikeCount(trackId: string): Promise<number> {
    const supabase = createClient()
    const { data, error } = await supabase.from("tracks").select("like_count").eq("id", trackId).single()

    if (error) {
        console.error("Error fetching like count:", error)
        return 0
    }

    return data?.like_count || 0
}

// ============================================================================
// COMMENT FUNCTIONS
// ============================================================================

export interface Comment {
    id: string
    user_id: string
    track_id: string
    content: string
    created_at: string
    updated_at: string
    user?: Profile
}

export async function addComment(trackId: string, content: string): Promise<Comment | null> {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from("comments")
        .insert({
            user_id: user.id,
            track_id: trackId,
            content,
        })
        .select()
        .single()

    if (error) {
        console.error("Error adding comment:", error)
        return null
    }

    return data
}

export async function getTrackComments(trackId: string): Promise<Comment[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("comments")
        .select("*, user:profiles(*)")
        .eq("track_id", trackId)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching comments:", error)
        return []
    }

    return data
}

export async function deleteComment(commentId: string): Promise<boolean> {
    const supabase = createClient()
    const { error } = await supabase.from("comments").delete().eq("id", commentId)

    if (error) {
        console.error("Error deleting comment:", error)
        return false
    }

    return true
}

// ============================================================================
// TIP FUNCTIONS
// ============================================================================

export interface Tip {
    id: string
    from_user_id: string
    to_artist_id: string
    track_id?: string
    amount: number
    transaction_hash?: string
    created_at: string
    from_user?: Profile
    to_artist?: Profile
}

export async function recordTip(
    toArtistId: string,
    amount: number,
    trackId?: string,
    transactionHash?: string,
): Promise<Tip | null> {
    const supabase = createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from("tips")
        .insert({
            from_user_id: user.id,
            to_artist_id: toArtistId,
            track_id: trackId,
            amount,
            transaction_hash: transactionHash,
        })
        .select()
        .single()

    if (error) {
        console.error("Error recording tip:", error)
        return null
    }

    return data
}

export async function getTipsSent(userId: string): Promise<Tip[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("tips")
        .select("*, to_artist:profiles!to_artist_id(*)")
        .eq("from_user_id", userId)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching tips sent:", error)
        return []
    }

    return data
}

export async function getTipsReceived(artistId: string): Promise<Tip[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("tips")
        .select("*, from_user:profiles!from_user_id(*)")
        .eq("to_artist_id", artistId)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching tips received:", error)
        return []
    }

    return data
}

export async function getTotalTipsReceived(artistId: string): Promise<number> {
    const supabase = createClient()
    const { data, error } = await supabase.from("tips").select("amount").eq("to_artist_id", artistId)

    if (error) {
        console.error("Error fetching total tips:", error)
        return 0
    }

    return data.reduce((sum: number, tip: { amount: number }) => sum + Number(tip.amount), 0)
}
