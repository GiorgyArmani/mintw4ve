import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ address: string }> }
) {
    const { address } = await params;

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Try to find by wallet address first
        let { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('wallet_address', address)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            console.error('Error fetching profile:', error);
            return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
        }

        // If not found by wallet, try by ID (in case address is actually an UUID)
        if (!profile) {
            const { data: profileById, error: errorById } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', address)
                .single();

            if (profileById) {
                profile = profileById;
            }
        }

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json(profile);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
