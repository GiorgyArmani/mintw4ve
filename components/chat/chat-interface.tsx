"use client"

import { useState, useEffect, useRef } from "react"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, User } from "lucide-react"
import { toast } from "sonner"

interface Message {
    id: string
    sender_id: string
    receiver_id: string
    content: string
    created_at: string
}

interface ChatInterfaceProps {
    recipientId: string
    recipientName: string
    recipientAvatar?: string
    currentUserId: string
}

export function ChatInterface({ recipientId, recipientName, recipientAvatar, currentUserId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!recipientId || !currentUserId) return

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat?other_user_id=${recipientId}`)
                const data = await res.json()
                if (data.messages) setMessages(data.messages)
            } catch (error) {
                console.error("Failed to fetch messages", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchMessages()

        // Subscribe to new messages
        const channel = supabase
            .channel(`chat:${currentUserId}:${recipientId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'marketplace_messages',
                    filter: `receiver_id=eq.${currentUserId}`, // Listen for messages sent TO me
                },
                (payload: RealtimePostgresChangesPayload<Message>) => {
                    const newMsg = payload.new as Message
                    if (newMsg.sender_id === recipientId) {
                        setMessages((prev) => [...prev, newMsg])
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [recipientId, currentUserId, supabase])

    useEffect(() => {
        // Scroll to bottom on new messages
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const tempId = Date.now().toString()
        const optimisticMessage: Message = {
            id: tempId,
            sender_id: currentUserId,
            receiver_id: recipientId,
            content: newMessage,
            created_at: new Date().toISOString(),
        }

        // Optimistic update
        setMessages((prev) => [...prev, optimisticMessage])
        setNewMessage("")

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sender_id: currentUserId,
                    receiver_id: recipientId,
                    content: optimisticMessage.content,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                console.error("Server error:", errorData)
                throw new Error(errorData.error || "Failed to send message")
            }

            // Replace optimistic message with real one (optional, or just let subscription handle it if I was listening to my own sends too)
            // But subscription only listens to receiver_id=currentUserId.
            // So I need to keep the optimistic one or update it with real ID.
            // For simplicity, we keep optimistic one.
        } catch (error) {
            console.error(error)
            toast.error("Failed to send message")
            // Revert optimistic update
            setMessages((prev) => prev.filter((m) => m.id !== tempId))
        }
    }

    return (
        <div className="flex flex-col h-[600px] bg-black/40 border border-white/10 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={recipientAvatar} />
                    <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-semibold text-white">{recipientName}</h3>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Online
                    </p>
                </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center text-muted-foreground py-10">Loading messages...</div>
                    ) : messages.length === 0 ? (
                        <div className="text-center text-muted-foreground py-10">No messages yet. Say hello!</div>
                    ) : (
                        messages.map((msg) => {
                            const isMe = msg.sender_id === currentUserId
                            return (
                                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl ${isMe
                                            ? "bg-mint text-black rounded-tr-none"
                                            : "bg-white/10 text-white rounded-tl-none"
                                            }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <span className="text-[10px] opacity-50 mt-1 block text-right">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>
                            )
                        })
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-black/20 border-white/10 focus:border-mint/50"
                />
                <Button type="submit" size="icon" className="bg-mint text-black hover:bg-mint/90" disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    )
}
