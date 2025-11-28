import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    let query = supabase
        .from('marketplace_requests')
        .select('*, requester:requester_id(username, avatar_url)')
        .order('created_at', { ascending: false })

    if (type && type !== 'all') {
        query = query.eq('type', type)
    }

    if (status) {
        query = query.eq('status', status)
    } else {
        // Default to open requests if not specified
        query = query.eq('status', 'open')
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ requests: data })
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, description, budget_min, budget_max, type, wallet_address } = body

        // Validate required fields
        if (!title || !description || !type || !wallet_address) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        // Get or create profile based on wallet address
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('wallet_address', wallet_address)
            .single()

        let requesterId: string

        if (profileError || !profileData) {
            // Create new profile
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    wallet_address,
                    username: wallet_address,
                    display_name: wallet_address.slice(0, 6) + '...' + wallet_address.slice(-4),
                    is_artist: false,
                })
                .select('id')
                .single()

            if (createError) {
                return NextResponse.json({ error: `Failed to create profile: ${createError.message}` }, { status: 500 })
            }
            requesterId = newProfile.id
        } else {
            requesterId = profileData.id
        }

        const { data, error } = await supabase
            .from('marketplace_requests')
            .insert({
                requester_id: requesterId,
                title,
                description,
                budget_min,
                budget_max,
                type,
                status: 'open'
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ request: data })
    } catch (error) {
        console.error('Request creation error:', error)
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
}
