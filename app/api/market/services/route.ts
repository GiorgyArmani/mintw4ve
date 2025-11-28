import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    let query = supabase
        .from('marketplace_services')
        .select('*, seller:seller_id(username, avatar_url)')
        .order('created_at', { ascending: false })

    if (type && type !== 'all') {
        query = query.eq('type', type)
    }

    if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ services: data })
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, description, price, type, cover_image, preview_url, delivery_time_days, wallet_address } = body

        // Validate required fields
        if (!title || !description || !price || !type || !wallet_address) {
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

        let sellerId: string

        if (profileError || !profileData) {
            // Create new profile
            const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                    wallet_address,
                    username: wallet_address,
                    display_name: wallet_address.slice(0, 6) + '...' + wallet_address.slice(-4),
                    is_artist: true,
                })
                .select('id')
                .single()

            if (createError) {
                return NextResponse.json({ error: `Failed to create profile: ${createError.message}` }, { status: 500 })
            }
            sellerId = newProfile.id
        } else {
            sellerId = profileData.id
        }

        const { data, error } = await supabase
            .from('marketplace_services')
            .insert({
                seller_id: sellerId,
                title,
                description,
                price,
                type,
                cover_image,
                preview_url,
                delivery_time_days: delivery_time_days || 1
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ service: data })
    } catch (error) {
        console.error('Service creation error:', error)
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
}
