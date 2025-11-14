import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await getSupabaseServerClient()
    const { id } = await params
    const body = await request.json()

    // Record the play
    const { error: playError } = await supabase.from("track_plays").insert([
      {
        track_id: id,
        listener_address: body.listenerAddress,
        tokens_earned: 10,
      },
    ])

    if (playError) throw playError

    // Update play count on track
    const { error: updateError } = await supabase.rpc("increment_play_count", {
      track_id: id,
    })

    // If RPC doesn't exist, fall back to manual update
    if (updateError) {
      const { data: track } = await supabase.from("tracks").select("play_count").eq("id", id).single()

      if (track) {
        await supabase
          .from("tracks")
          .update({ play_count: (track.play_count || 0) + 1 })
          .eq("id", id)
      }
    }

    return NextResponse.json({ success: true, tokensEarned: 10 })
  } catch (error) {
    console.error("[v0] Error recording play:", error)
    return NextResponse.json({ error: "Failed to record play" }, { status: 500 })
  }
}
