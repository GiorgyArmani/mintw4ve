import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get('other_user_id')

    // Use service role to bypass RLS for reading messages
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get current user for auth verification
    const supabaseAuth = await (await import("@/lib/supabase/server")).createClient()
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!otherUserId) {
        return NextResponse.json({ error: "Missing other_user_id" }, { status: 400 })
    }

    // Get current user's profile ID
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('wallet_address', user.email || user.id)
        .single()

    if (!currentProfile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Fetch messages between current user and other user
    const { data, error } = await supabase
        .from('marketplace_messages')
        .select('*')
        .or(`and(sender_id.eq.${currentProfile.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentProfile.id})`)
        .order('created_at', { ascending: true })

    if (error) {
        console.error("Error fetching messages:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ messages: data })
}

export async function POST(request: Request) {
    // Use service role key to bypass RLS
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get current user (for auth verification only)
    const supabaseAuth = await (await import("@/lib/supabase/server")).createClient()
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser()

    if (userError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { sender_id, receiver_id, content, related_service_id, related_request_id } = body

        // Validate required fields
        if (!sender_id || !receiver_id || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const { data, error } = await supabase
            .from('marketplace_messages')
            .insert({
                sender_id,
                receiver_id,
                content,
                related_service_id,
                related_request_id
            })
            .select()
            .single()

        if (error) {
            console.error("Supabase insert error:", error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ message: data })
    } catch (error) {
        console.error("Chat API error:", error)
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
}
