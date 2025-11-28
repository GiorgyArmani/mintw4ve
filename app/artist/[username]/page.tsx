"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PageShell } from "@/components/page-shell"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageCircle, Share2, Twitter, Globe, Instagram, Music, Users } from "lucide-react"
import { useAccount } from "wagmi"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { VinylRecord } from "@/components/vinyl-record"
import { SupportButton } from "@/components/profile/support-button"

interface Profile {
    id: string
    wallet_address: string
    username: string
    display_name: string
    bio: string
    avatar_url: string
    cover_image_url: string
    is_artist: boolean
    genres: string[]
    social_links: {
        twitter?: string
        instagram?: string
        website?: string
    }
    created_at: string
}

interface Track {
    id: string
    title: string
    artist_id: string
    description: string
    genre: string
    audio_url: string
    cover_url: string
    like_count: number
    comment_count: number
    created_at: string
}

export default function ArtistProfilePage() {
    const params = useParams()
    const username = params.username as string
    const { address: currentAddress } = useAccount()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [tracks, setTracks] = useState<Track[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("tracks")

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true)
            try {
                // Fetch Profile by username
                const profileRes = await fetch(`/api/profiles/username/${username}`)
                if (profileRes.ok) {
                    const profileData = await profileRes.json()
                    setProfile(profileData)

                    // Fetch Tracks
                    if (profileData.id) {
                        const supabase = createClient()
                        const { data: tracksData } = await supabase
                            .from('tracks')
                            .select('*')
                            .eq('artist_id', profileData.id)
                            .order('created_at', { ascending: false })

                        if (tracksData) {
                            setTracks(tracksData)
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile data:", error)
            } finally {
                setIsLoading(false)
            }
        }

        if (username) {
            fetchProfileData()
        }
    }, [username])

    if (isLoading) {
        return (
            <PageShell>
                <div className="container mx-auto px-4 py-12 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mint"></div>
                </div>
            </PageShell>
        )
    }

    if (!profile) {
        return (
            <PageShell>
                <div className="container mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
                    <p className="text-muted-foreground">The artist you are looking for does not exist.</p>
                </div>
            </PageShell>
        )
    }

    return (
        <PageShell>
            {/* Banner */}
            <div className="h-64 w-full bg-gradient-to-r from-purple-900 to-black relative overflow-hidden">
                {profile.cover_image_url && (
                    <img
                        src={profile.cover_image_url}
                        alt="Cover"
                        className="w-full h-full object-cover opacity-50"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar */}
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-full border-4 border-black bg-black overflow-hidden shadow-2xl shadow-mint/20">
                            <Avatar className="w-full h-full">
                                <AvatarImage src={profile.avatar_url} />
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-mint to-violet text-white">
                                    {profile.username?.[0]?.toUpperCase() || "?"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1 pt-24 md:pt-20 space-y-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-1">
                                    {profile.display_name || profile.username || "Anonymous Artist"}
                                </h1>
                                <p className="text-mint font-medium">@{profile.username || "anonymous"}</p>
                            </div>

                            <div className="flex gap-3">
                                {currentAddress?.toLowerCase() !== profile.wallet_address?.toLowerCase() && (
                                    <>
                                        <SupportButton
                                            walletAddress={profile.wallet_address}
                                            artistName={profile.display_name || profile.username || "this artist"}
                                        />
                                        <Link href={`/messages?userId=${profile.id}&username=${profile.username}`}>
                                            <Button className="bg-mint text-black hover:bg-mint/90">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                DM Artist
                                            </Button>
                                        </Link>
                                    </>
                                )}
                                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {profile.bio && (
                            <p className="text-muted-foreground max-w-2xl text-lg">
                                {profile.bio}
                            </p>
                        )}

                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span className="text-white font-semibold">0</span> Followers
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span className="text-white font-semibold">0</span> Following
                            </div>
                            <div className="flex items-center gap-2">
                                <Music className="w-4 h-4" />
                                <span className="text-white font-semibold">{tracks.length}</span> Tracks
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 pt-2">
                            {profile.social_links?.twitter && (
                                <a href={profile.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-400 transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                            {profile.social_links?.instagram && (
                                <a href={profile.social_links.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-500 transition-colors">
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                            {profile.social_links?.website && (
                                <a href={profile.social_links.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-mint transition-colors">
                                    <Globe className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="mt-12">
                    <Tabs defaultValue="tracks" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="bg-white/5 border border-white/10 p-1">
                            <TabsTrigger value="tracks" className="data-[state=active]:bg-mint data-[state=active]:text-black">
                                Tracks
                            </TabsTrigger>
                            <TabsTrigger value="about" className="data-[state=active]:bg-mint data-[state=active]:text-black">
                                About
                            </TabsTrigger>
                            <TabsTrigger value="collectibles" className="data-[state=active]:bg-mint data-[state=active]:text-black">
                                Collectibles
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="tracks" className="mt-8">
                            {tracks.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tracks.map((track) => (
                                        <Link key={track.id} href={`/tracks/${track.id}`}>
                                            <Card className="glass-card border-white/10 hover:border-mint/50 transition-all cursor-pointer">
                                                <CardContent className="p-4">
                                                    <img src={track.cover_url} alt={track.title} className="w-full aspect-square object-cover rounded-lg mb-3" />
                                                    <h3 className="font-semibold text-white truncate">{track.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{track.genre}</p>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-muted-foreground">
                                    <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No tracks released yet.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="about" className="mt-8">
                            <Card className="glass-card border-white/10">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-4">About</h3>
                                    <p className="text-muted-foreground">
                                        {profile.bio || "No bio available."}
                                    </p>

                                    <div className="mt-6">
                                        <h4 className="font-semibold mb-2">Genres</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.genres?.map((genre) => (
                                                <span key={genre} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm">
                                                    {genre}
                                                </span>
                                            )) || <span className="text-muted-foreground text-sm">No genres listed</span>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="collectibles" className="mt-8">
                            <div className="text-center py-20 text-muted-foreground">
                                <p>Collectibles coming soon.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </PageShell>
    )
}
