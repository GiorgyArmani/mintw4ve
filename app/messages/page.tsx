"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { useAccount } from "wagmi"
import { PageShell } from "@/components/page-shell"
import { ChatInterface } from "@/components/chat/chat-interface"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { MessageCircle, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface Conversation {
    partner: {
        id: string
        username: string
        display_name: string
        avatar_url: string
    }
    lastMessage: {
        content: string
        created_at: string
        isRead: boolean
        isOwn: boolean
    }
}

function MessagesContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const recipientId = searchParams.get("userId")
    const recipientName = searchParams.get("username") || "User"
    const { address } = useAccount()

    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [isLoadingConversations, setIsLoadingConversations] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const getProfileId = async () => {
            if (!address) return

            // Fetch the profile ID using the wallet address
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('wallet_address', address)
                .single()

            if (profile) {
                setCurrentUserId(profile.id)
            } else {
                console.error("Profile not found for wallet:", address)
            }
        }

        getProfileId()
    }, [address, supabase])

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch('/api/chat/conversations')
                if (res.ok) {
                    const data = await res.json()
                    if (data.conversations) {
                        setConversations(data.conversations)
                    }
                }
            } catch (error) {
                console.error("Failed to fetch conversations:", error)
            } finally {
                setIsLoadingConversations(false)
            }
        }

        if (currentUserId) {
            fetchConversations()
        }
    }, [currentUserId])

    const handleSelectConversation = (partner: Conversation['partner']) => {
        router.push(`/messages?userId=${partner.id}&username=${partner.username || partner.display_name}`)
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Messages</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
                {/* Sidebar (Conversation List) */}
                <div className={`${recipientId ? 'hidden lg:block' : 'block'} col-span-1 space-y-4`}>
                    <Card className="h-full glass-card border-white/10 p-4 flex flex-col">
                        <h2 className="font-semibold mb-4 text-muted-foreground uppercase text-xs tracking-wider">Recent Chats</h2>
                        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                            {isLoadingConversations ? (
                                <div className="text-center py-4 text-sm text-muted-foreground">Loading...</div>
                            ) : conversations.length === 0 ? (
                                <div className="text-sm text-muted-foreground text-center py-10">
                                    No recent conversations
                                </div>
                            ) : (
                                conversations.map((conv) => (
                                    <div
                                        key={conv.partner.id}
                                        onClick={() => handleSelectConversation(conv.partner)}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                                            recipientId === conv.partner.id
                                                ? "bg-mint/20 border border-mint/30"
                                                : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={conv.partner.avatar_url} />
                                            <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="font-medium text-sm truncate text-white">
                                                    {conv.partner.display_name || conv.partner.username || "User"}
                                                </h4>
                                                <span className="text-[10px] text-muted-foreground flex-shrink-0">
                                                    {formatDistanceToNow(new Date(conv.lastMessage.created_at), { addSuffix: false })}
                                                </span>
                                            </div>
                                            <p className={cn(
                                                "text-xs truncate",
                                                !conv.lastMessage.isRead && !conv.lastMessage.isOwn ? "text-white font-semibold" : "text-muted-foreground"
                                            )}>
                                                {conv.lastMessage.isOwn ? "You: " : ""}{conv.lastMessage.content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>

                {/* Chat Area */}
                <div className={`${!recipientId ? 'hidden lg:block' : 'block'} col-span-1 lg:col-span-3`}>
                    {currentUserId && recipientId ? (
                        <ChatInterface
                            recipientId={recipientId}
                            recipientName={recipientName}
                            currentUserId={currentUserId}
                        />
                    ) : (
                        <Card className="h-full glass-card border-white/10 flex flex-col items-center justify-center text-muted-foreground">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <MessageCircle className="w-8 h-8" />
                            </div>
                            <p>Select a user to start chatting</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function MessagesPage() {
    return (
        <PageShell>
            <Suspense fallback={
                <div className="container mx-auto px-4 py-12">
                    <div className="flex justify-center items-center h-[600px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint"></div>
                    </div>
                </div>
            }>
                <MessagesContent />
            </Suspense>
        </PageShell>
    )
}
