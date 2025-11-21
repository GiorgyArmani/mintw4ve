import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json();

        if (!address) {
            return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('wallet_address', address)
            .single();

        if (existingProfile) {
            return NextResponse.json({ success: true, id: existingProfile.id, isNew: false });
        }

        // Create new profile if not exists
        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
                wallet_address: address,
                username: address, // Use wallet address as default username
                display_name: address.slice(0, 6) + '...' + address.slice(-4),
                is_artist: false, // Default to false, becomes true on first upload
            })
            .select('id')
            .single();

        if (createError) {
            console.error('Failed to create profile:', createError);
            return NextResponse.json({ error: createError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: newProfile.id, isNew: true });

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
