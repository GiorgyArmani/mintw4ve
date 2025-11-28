import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { wallet_address, username, display_name, bio, avatar_url } = body;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Verify authentication
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if username is taken (if provided and different from current)
        if (username) {
            const { data: existingUser } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', username)
                .neq('id', user.id) // Exclude current user
                .single();

            if (existingUser) {
                return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
            }
        }

        // Update profile
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (username) updateData.username = username;
        if (display_name) updateData.display_name = display_name;
        if (bio !== undefined) updateData.bio = bio;
        if (avatar_url) updateData.avatar_url = avatar_url;
        if (wallet_address) updateData.wallet_address = wallet_address; // Update wallet address if provided

        // Mark profile as complete if username is provided
        if (username) {
            updateData.is_profile_complete = true;
        }

        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id) // Update by User ID
            .select()
            .single();

        if (error) {
            console.error('Failed to update profile:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, profile: data });

    } catch (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// GET endpoint to check username availability
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const username = searchParams.get('username');

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single();

        return NextResponse.json({ available: !data });

    } catch (error) {
        console.error('Username check error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
