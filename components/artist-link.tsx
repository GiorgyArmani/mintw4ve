"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface ArtistLinkProps {
    walletAddress: string
    children: React.ReactNode
    className?: string
    onClick?: (e: React.MouseEvent) => void
}

export function ArtistLink({ walletAddress, children, className, onClick }: ArtistLinkProps) {
    const [username, setUsername] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const fetchUsername = async () => {
            const { data } = await supabase
                .from('profiles')
                .select('username')
                .eq('wallet_address', walletAddress)
                .single()

            if (data?.username) {
                setUsername(data.username)
            }
        }

        fetchUsername()
    }, [walletAddress, supabase])

    // If we have username, use it. Otherwise fall back to wallet address
    const href = username ? `/artist/${username}` : `/artist/${walletAddress}`

    return (
        <Link href={href} className={className} onClick={onClick}>
            {children}
        </Link>
    )
}
