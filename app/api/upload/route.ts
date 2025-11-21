import { NextRequest, NextResponse } from 'next/server';
import { uploadTrackAssets } from '@/lib/storage';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds for file upload

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        // Validate required fields
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const genre = formData.get('genre') as string;
        const audio = formData.get('audio') as File;
        const artist = formData.get('artist') as string;

        if (!title || !audio) {
            return NextResponse.json(
                { error: 'Title and audio file are required' },
                { status: 400 }
            );
        }

        // Validate file size (max 50MB for audio)
        if (audio.size > 50 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'Audio file must be less than 50MB' },
                { status: 400 }
            );
        }

        // Validate audio file type
        const validAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
        if (!validAudioTypes.includes(audio.type)) {
            return NextResponse.json(
                { error: 'Audio must be MP3 or WAV format' },
                { status: 400 }
            );
        }

        // Upload to Supabase Storage
        const uploadResult = await uploadTrackAssets(formData);

        // Store track metadata in Supabase database
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);

            // First, get or create artist
            const { data: artistData, error: artistError } = await supabase
                .from('artists')
                .select('id')
                .eq('wallet', artist)
                .single();

            let artistId: string;

            if (artistError || !artistData) {
                // Create new artist
                const { data: newArtist, error: createError } = await supabase
                    .from('artists')
                    .insert({
                        wallet: artist,
                        display_name: artist.slice(0, 6) + '...' + artist.slice(-4),
                    })
                    .select('id')
                    .single();

                if (createError) {
                    console.error('Failed to create artist:', createError);
                    throw new Error('Failed to create artist');
                }

                artistId = newArtist.id;
            } else {
                artistId = artistData.id;
            }

            // Insert track
            const { data: trackData, error: trackError } = await supabase
                .from('tracks')
                .insert({
                    artist_id: artistId,
                    title,
                    description,
                    genre,
                    audio_url: uploadResult.audioUrl,
                    cover_url: uploadResult.coverUrl,
                    metadata_uri: uploadResult.metadataUri,
                })
                .select()
                .single();

            if (trackError) {
                console.error('Failed to insert track:', trackError);
                throw new Error('Failed to save track metadata');
            }

            return NextResponse.json({
                success: true,
                track: trackData,
                ...uploadResult,
            });
        }

        // Fallback response if no database
        return NextResponse.json({
            success: true,
            ...uploadResult,
        });
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