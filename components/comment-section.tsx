"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Send, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAccount } from "wagmi"
import { addComment, getTrackComments, deleteComment, type Comment } from "@/lib/supabase/social"
import { formatDistanceToNow } from "date-fns"

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
    const [showComments, setShowComments] = useState(false)

    useEffect(() => {
        if (showComments) {
            loadComments()
        }
    }, [showComments, trackId])

    const loadComments = async () => {
        setIsLoading(true)
        const data = await getTrackComments(trackId)
        setComments(data)
        setIsLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newComment.trim() || !isConnected || isSubmitting) return

        setIsSubmitting(true)

        const comment = await addComment(trackId, newComment.trim())

        if (comment) {
            setComments([comment, ...comments])
            setNewComment("")
        }

        setIsSubmitting(false)
    }

    const handleDelete = async (commentId: string) => {
        const success = await deleteComment(commentId)

        if (success) {
            setComments(comments.filter((c) => c.id !== commentId))
        }
    }

    return (
        <div className="space-y-4">
            {/* Toggle Button */}
            <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)} className="gap-1.5 hover:text-mint">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{comments.length || initialCommentCount}</span>
            </Button>

            {/* Comments Section */}
            {showComments && (
                <Card className="glass-card p-4 space-y-4">
                    {/* Add Comment Form */}
                    {isConnected ? (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="bg-white/5 border-white/10 resize-none"
                                rows={3}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" disabled={!newComment.trim() || isSubmitting} className="bg-mint text-black hover:bg-mint/90">
                                    <Send className="w-4 h-4 mr-2" />
                                    {isSubmitting ? "Posting..." : "Post"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">Connect your wallet to comment</p>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                        {isLoading ? (
                            <p className="text-sm text-muted-foreground text-center">Loading comments...</p>
                        ) : comments.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center">No comments yet. Be the first!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={comment.user?.avatar_url} />
                                        <AvatarFallback>{comment.user?.username?.[0]?.toUpperCase() || "?"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-semibold">{comment.user?.display_name || comment.user?.username || "Anonymous"}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            {comment.user_id === address && (
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(comment.id)} className="h-6 w-6 p-0 hover:text-red-500">
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            )}
        </div>
    )
}
