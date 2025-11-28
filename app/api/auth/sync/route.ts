import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        // Handle empty body gracefully
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { address } = body;

        if (!address) {
            return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Try to get the user from the session (Authorization header)
        const authHeader = req.headers.get('Authorization');
        let user = null;

        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            const { data: { user: sessionUser }, error: sessionError } = await supabase.auth.getUser(token);

            if (sessionUser) {
                console.log('Found user via session:', sessionUser.id);
                user = sessionUser;
            } else if (sessionError) {
                console.warn('Session verification failed:', sessionError.message);
            }
        }

        // 2. If no session user, try admin lookup by address (Fallback)
        if (!user) {
            console.log('No session user, trying admin lookup for address:', address);
            const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();

            if (userError) {
                console.error('Failed to list users:', userError);
                return NextResponse.json({ error: 'Failed to verify user' }, { status: 500 });
            }

            user = users.find(u =>
                u.user_metadata?.address?.toLowerCase() === address.toLowerCase() ||
                u.email?.toLowerCase().includes(address.toLowerCase())
            );
        }

        if (!user) {
            console.error('User not found for address:', address);
            return NextResponse.json({ error: 'User not found in auth system' }, { status: 404 });
        }

        // 3. Ensure user metadata has the address
        if (user.user_metadata?.address?.toLowerCase() !== address.toLowerCase()) {
            console.log('Updating user metadata with address');
            await supabase.auth.admin.updateUserById(user.id, {
                user_metadata: { ...user.user_metadata, address: address }
            });
        }

        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
            .from('profiles')
            .select('id, is_profile_complete, wallet_address, username')
            .eq('id', user.id)
            .single();

        if (existingProfile) {
            // Fix: If profile exists but has no wallet address (created by trigger without metadata), update it
            if (!existingProfile.wallet_address || existingProfile.wallet_address !== address) {
                console.log('Updating profile with wallet address:', address);
                await supabase
                    .from('profiles')
                    .update({
                        wallet_address: address,
                        // Only set username if it's missing
                        ...(!existingProfile.username ? { username: address } : {})
                    })
                    .eq('id', user.id);
            }

            return NextResponse.json({
                success: true,
                id: existingProfile.id,
                isNew: false,
                isProfileComplete: existingProfile.is_profile_complete || false
            });
        }

        // Create new profile if not exists, using the correct User ID
        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                wallet_address: address,
                username: address,
                display_name: address.slice(0, 6) + '...' + address.slice(-4),
                is_artist: false,
                is_profile_complete: false
            })
            .select('id, is_profile_complete')
            .single();

    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
