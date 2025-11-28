import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { filename, filetype, bucket, artist } = body;

        if (!filename || !filetype || !bucket) {
            return NextResponse.json(
                { error: 'Missing required fields: filename, filetype, bucket' },
                { status: 400 }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Missing Supabase credentials');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Sanitize filename
        const sanitizedFilename = filename
            .toLowerCase()
            .replace(/[^a-z0-9.-]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const finalFilename = `${timestamp}-${random}-${sanitizedFilename}`;

        // Construct path based on bucket
        let path = '';
        if (bucket === 'mintwave-audio') {
            path = `tracks/${artist || 'unknown'}/${finalFilename}`;
        } else if (bucket === 'mintwave-images') {
            path = `covers/${artist || 'unknown'}/${finalFilename}`;
        } else {
            path = `uploads/${artist || 'unknown'}/${finalFilename}`;
        }

        // Create signed upload URL
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUploadUrl(path);

        if (error) {
            console.error('Error creating signed upload URL:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            signedUrl: data.signedUrl,
            token: data.token,
            path: data.path,
            fullPath: path // Return the path we decided on
        });

    } catch (error) {
        console.error('Error in sign route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
