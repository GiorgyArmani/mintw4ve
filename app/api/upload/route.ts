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

        console.log('Upload: Received request', { title, artist, audioSize: audio?.size });

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
        console.log('Upload: Uploading assets to storage...');
        const uploadResult = await uploadTrackAssets(formData);
        console.log('Upload: Assets uploaded', uploadResult);

        // Store track metadata in Supabase database
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        console.log('Upload: Checking DB config', { hasUrl: !!supabaseUrl, hasKey: !!supabaseKey });

        if (supabaseUrl && supabaseKey) {
            const supabase = createClient(supabaseUrl, supabaseKey);

            // First, get or create profile (artist)
            console.log('Upload: Checking profile for', artist);
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('wallet_address', artist)
                .single();

            let artistId: string;

            if (profileError || !profileData) {
                console.log('Upload: Profile not found, creating new profile...', { profileError });
                // Create new profile
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert({
                        wallet_address: artist,
                        username: artist, // Use wallet address as default username
                        display_name: artist.slice(0, 6) + '...' + artist.slice(-4),
                        is_artist: true,
                    })
                    .select('id')
                    .single();

                if (createError) {
                    console.error('Upload: Failed to create profile:', createError);
                    throw new Error(`Failed to create artist profile: ${createError.message}`);
                }

                artistId = newProfile.id;
                console.log('Upload: Created new profile', artistId);
            } else {
                artistId = profileData.id;
                console.log('Upload: Found existing profile', artistId);
            }

            // Insert track
            console.log('Upload: Inserting track for artist', artistId);
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
                console.error('Upload: Failed to insert track:', trackError);
                throw new Error(`Failed to save track metadata: ${trackError.message}`);
            }

            console.log('Upload: Track saved successfully', trackData.id);

            return NextResponse.json({
                success: true,
                track: trackData,
                ...uploadResult,
            });
        } else {
            console.error('Upload: Missing Supabase credentials, skipping DB insert');
            // Fallback response if no database
            return NextResponse.json({
                success: true,
                ...uploadResult,
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