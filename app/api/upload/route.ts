import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description, genre, artist, audioPath, coverPath, audioUrl, coverUrl, metadataUri } = body;

        console.log('Upload: Received metadata', { title, artist, audioPath });

        if (!title || !audioPath || !artist) {
            return NextResponse.json(
                { error: 'Title, artist, and audio path are required' },
                { status: 400 }
            );
        }

        // Store track metadata in Supabase database
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);

            // First, get or create profile (artist)
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('wallet_address', artist)
                .single();

            let artistId: string;

            if (profileError || !profileData) {
                // Create new profile
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                        wallet_address: artist,
                        username: artist,
                        display_name: artist.slice(0, 6) + '...' + artist.slice(-4),
                        is_artist: true,
                    })
                    .select('id')
                    .single();

                if (createError) {
                    throw new Error(`Failed to create artist profile: ${createError.message}`);
                }
                artistId = newProfile.id;
            } else {
                artistId = profileData.id;
            }

            // Insert track
            const { data: trackData, error: trackError } = await supabase
                .from('tracks')
                .insert({
                    artist_id: artistId,
                    title,
                    description,
                    genre,
                    audio_url: audioUrl, // Client provides the full public URL
                    cover_url: coverUrl, // Client provides the full public URL
                    metadata_uri: metadataUri, // Client provides or we construct it
                })
                .select()
                .single();

            if (trackError) {
                throw new Error(`Failed to save track metadata: ${trackError.message}`);
            }

            return NextResponse.json({
                success: true,
                track: trackData
            });
        } else {
            return NextResponse.json({
                success: true,
                warning: 'Track uploaded but not saved to database (missing credentials)'
            });
        }
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'Upload failed',
            },
            { status: 500 }
        );
    }
}