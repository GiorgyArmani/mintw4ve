import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials', { url: !!supabaseUrl, key: !!supabaseKey })
    return NextResponse.json({
      tracks: [],
      debug: {
        error: 'Missing Supabase credentials',
        env: {
          url: !!supabaseUrl,
          key: !!supabaseKey
        }
      }
    })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 1. Fetch tracks first
    const { data: tracks, error: tracksError } = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: false })

    if (tracksError) {
      console.error('Failed to fetch tracks:', tracksError)
      return NextResponse.json({ tracks: [], debug: { error: tracksError } })
    }

    // 2. Fetch associated profiles (artists)
    const artistIds = [...new Set(tracks?.map(t => t.artist_id).filter(Boolean))]

    let profilesMap = new Map()

    if (artistIds.length > 0) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, wallet_address, display_name, avatar_url')
        .in('id', artistIds)

      if (profilesError) {
        console.error('Failed to fetch profiles:', profilesError)
      } else {
        profiles?.forEach(profile => {
          profilesMap.set(profile.id, profile)
        })
      }
    }

    // 3. Transform and join data
    const formattedTracks = tracks?.map(track => {
      const artist = profilesMap.get(track.artist_id)

      return {
        id: track.id,
        title: track.title,
        artist_id: track.artist_id,
        artist: artist?.wallet_address || 'Unknown',
        displayName: artist?.display_name || 'Unknown Artist',
        description: track.description || '',
        genre: track.genre || 'Unknown',
        audioUrl: track.audio_url,
        coverUrl: track.cover_url,
        metadataUri: track.metadata_uri,
        tokenId: track.token_id,
        playCount: track.play_count || 0,
        createdAt: track.created_at,
        like_count: track.like_count || 0,
        comment_count: track.comment_count || 0,
      }
    }) || []

    return NextResponse.json({ tracks: formattedTracks })
  } catch (error) {
    console.error('Error fetching tracks:', error)
    return NextResponse.json({ tracks: [], debug: { error: String(error) } })
  }
}