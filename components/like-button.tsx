"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccount } from "wagmi"
import { likeTrack, unlikeTrack } from "@/lib/supabase/social"
import { useSocialStore } from "@/store/social"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
    trackId: string
    initialLikeCount?: number
    className?: string
}

export function LikeButton({ trackId, initialLikeCount = 0, className }: LikeButtonProps) {
    const { isConnected } = useAccount()
    const { isTrackLiked, addLikedTrack, removeLikedTrack } = useSocialStore()
    const [likeCount, setLikeCount] = useState(initialLikeCount)
    const [isLiking, setIsLiking] = useState(false)

    const liked = isTrackLiked(trackId)

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!isConnected || isLiking) return

        setIsLiking(true)

        // Optimistic update
        if (liked) {
            setLikeCount((prev: number) => Math.max(0, prev - 1))
            removeLikedTrack(trackId)
            await unlikeTrack(trackId)
        } else {
            setLikeCount((prev: number) => prev + 1)
            addLikedTrack(trackId)
            await likeTrack(trackId)
        }

        setIsLiking(false)
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={!isConnected || isLiking}
            className={cn("gap-1.5 hover:text-mint", liked && "text-mint", className)}
        >
            <Heart className={cn("w-4 h-4", liked && "fill-mint")} />
            <span className="text-sm">{likeCount}</span>
        </Button>
    )
}
