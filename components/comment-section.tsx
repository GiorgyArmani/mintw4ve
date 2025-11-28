"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAccount } from "wagmi"
import { addComment, getTrackComments, deleteComment, type Comment } from "@/lib/supabase/social"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import Link from "next/link"

interface CommentSectionProps {
    trackId: string
    initialCommentCount?: number
}

export function CommentSection({ trackId, initialCommentCount = 0 }: CommentSectionProps) {
    const { isConnected, address } = useAccount()
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Load comments on mount
    useEffect(() => {
        loadComments()
    }, [trackId])

    // Real-time subscription
    useEffect(() => {
        const supabase = createClient()

        const channel = supabase
            .channel(`comments:${trackId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'comments',
                    filter: `track_id=eq.${trackId}`
                },
                (payload: any) => {
                    if (payload.eventType === 'INSERT') {
                        // For new comments, we need to fetch the user profile
                        // Ideally we'd just fetch the single comment with relation, 
                        // but for simplicity and consistency we can reload or fetch the single item.
                        // Let's reload for now to ensure we get the full user relation.
                        loadComments()
                    } else if (payload.eventType === 'DELETE') {
                        setComments(prev => prev.filter(c => c.id !== payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [trackId])

    const loadComments = async () => {
        // Don't set loading to true if we already have comments (for background updates)
        if (comments.length === 0) setIsLoading(true)

        try {
            const data = await getTrackComments(trackId)
            setComments(data)
        } catch (error) {
            console.error("Failed to load comments:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newComment.trim() || !isConnected || isSubmitting) return

        setIsSubmitting(true)

        try {
            const comment = await addComment(trackId, newComment.trim())
            if (comment) {
                setNewComment("")
                toast.success("Comment posted!")
                // The realtime subscription will handle adding it to the list
            }
        } catch (error) {
            console.error("Failed to post comment:", error)
            toast.error("Failed to post comment")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async (commentId: string) => {
        try {
            const success = await deleteComment(commentId)
            if (success) {
                toast.success("Comment deleted")
                // The realtime subscription will handle removing it from the list
            } else {
                toast.error("Failed to delete comment")
            }
        } catch (error) {
            console.error("Failed to delete comment:", error)
            toast.error("Failed to delete comment")
        }
    }

    return (
        <div className="space-y-6">
            {/* Add Comment Form */}
            {isConnected ? (
                <div className="flex gap-4">
                    <div className="flex-1">
                        <form onSubmit={handleSubmit} className="relative">
                            <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts..."
                                className="bg-white/5 border-white/10 resize-none min-h-[100px] pr-12 focus:bg-white/10 transition-colors"
                                disabled={isSubmitting}
                            />
                            <div className="absolute bottom-3 right-3">
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!newComment.trim() || isSubmitting}
                                    className="bg-mint text-black hover:bg-mint/90 h-8 w-8 p-0 rounded-full"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <Card className="bg-white/5 border-white/10 p-6 text-center">
                    <p className="text-muted-foreground mb-4">Connect your wallet to join the conversation</p>
                    {/* The connect button is in the header, so we just guide them */}
                </Card>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 text-mint animate-spin" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4 group">
                                <Link href={`/artist/${comment.user?.username || comment.user?.wallet_address}`}>
                                    <Avatar className="w-10 h-10 border border-white/10 cursor-pointer transition-transform hover:scale-105">
                                        <AvatarImage src={comment.user?.avatar_url} />
                                        <AvatarFallback className="bg-gradient-to-br from-mint to-violet text-white">
                                            {comment.user?.username?.[0]?.toUpperCase() || "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/artist/${comment.user?.username || comment.user?.wallet_address}`}
                                                className="font-semibold hover:text-mint transition-colors"
                                            >
                                                {comment.user?.display_name || comment.user?.username || "Anonymous"}
                                            </Link>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        {comment.user_id === address && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(comment.id)}
                                                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
