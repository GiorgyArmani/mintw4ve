"use client"

import { useState, useEffect } from "react"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

interface Notification {
    id: string
    type: string
    content: string
    read: boolean
    created_at: string
    related_id?: string
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const supabase = createClient()

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications")
            const data = await res.json()
            if (data.notifications) {
                setNotifications(data.notifications)
                setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length)
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error)
        }
    }

    useEffect(() => {
        fetchNotifications()

        // Subscribe to new notifications
        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'marketplace_notifications',
                },
                (payload: RealtimePostgresChangesPayload<Notification>) => {
                    // Ideally check if it's for me, but RLS handles fetch. 
                    // For realtime, I need to filter by user_id in the client or use a channel per user.
                    // Since I can't easily get current user ID here without context or call, 
                    // I'll just re-fetch if I receive any event (inefficient but works if volume is low)
                    // Or better: subscribe to `marketplace_notifications:user_id=eq.${userId}` if I had userId.
                    // For now, just re-fetch.
                    fetchNotifications()
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const markAsRead = async (id: string) => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })

            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error("Failed to mark as read", error)
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-mint text-black rounded-full">
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black/90 border-white/10 p-0" align="end">
                <div className="p-4 border-b border-white/10">
                    <h4 className="font-semibold text-white">Notifications</h4>
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                            No notifications
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${!notification.read ? 'bg-white/5' : ''}`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <p className="text-sm text-white mb-1">{notification.content}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
