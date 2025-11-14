import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await getSupabaseServerClient()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = supabase.from("marketplace_items").select("*").order("created_at", { ascending: false })

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data: items, error } = await query

    if (error) throw error

    return NextResponse.json(items)
  } catch (error) {
    console.error("[v0] Error fetching marketplace items:", error)
    return NextResponse.json({ error: "Failed to fetch marketplace items" }, { status: 500 })
  }
}
