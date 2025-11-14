import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await getSupabaseServerClient()

    const { data: tracks, error } = await supabase
      .from("tracks")
      .select("*")
      .order("uploaded_at", { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json(tracks)
  } catch (error) {
    console.error("[v0] Error fetching tracks:", error)
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    const body = await request.json()

    const { data: track, error } = await supabase
      .from("tracks")
      .insert([
        {
          title: body.title,
          artist_address: body.artistAddress,
          artist_name: body.artistName,
          description: body.description,
          genre: body.genre,
          audio_url: body.audioUrl,
          cover_url: body.coverUrl,
          duration: body.duration,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(track, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating track:", error)
    return NextResponse.json({ error: "Failed to create track" }, { status: 500 })
  }
}
