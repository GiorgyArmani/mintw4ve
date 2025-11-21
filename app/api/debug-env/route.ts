import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    return NextResponse.json({
        status: 'ok',
        env: {
            NEXT_PUBLIC_SUPABASE_URL: url ? 'Set (starts with ' + url.substring(0, 8) + '...)' : 'MISSING',
            SUPABASE_SERVICE_ROLE_KEY: key ? 'Set (starts with ' + key.substring(0, 8) + '...)' : 'MISSING',
        },
        timestamp: new Date().toISOString()
    })
}
