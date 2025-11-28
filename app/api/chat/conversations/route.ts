import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // Fetch all messages involving the user
        // Note: This is not the most efficient way for large datasets, but works for MVP
        // A proper solution would use a separate 'conversations' table or a complex SQL view
        const { data: messages, error } = await supabase
            .from('marketplace_messages')
            .select(`
                *,
                sender:profiles!sender_id(id, username, display_name, avatar_url),
                receiver:profiles!receiver_id(id, username, display_name, avatar_url)
            `)
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('created_at', { ascending: false })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Group by conversation partner
        const conversationsMap = new Map()

        messages.forEach((msg: any) => {
            const isSender = msg.sender_id === user.id
            const partnerId = isSender ? msg.receiver_id : msg.sender_id
            const partner = isSender ? msg.receiver : msg.sender

            if (!conversationsMap.has(partnerId)) {
                conversationsMap.set(partnerId, {
                    partner,
                    lastMessage: {
                        content: msg.content,
                        created_at: msg.created_at,
                        isRead: msg.is_read,
                        isOwn: isSender
                    }
                })
            }
        })

        const conversations = Array.from(conversationsMap.values())

        return NextResponse.json({ conversations })
    } catch (error) {
        console.error("Error fetching conversations:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
