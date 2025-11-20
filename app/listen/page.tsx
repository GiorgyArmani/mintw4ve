"use client"

import { useState, useEffect } from "react"
import { PageShell } from "@/components/page-shell"
import { GradientText } from "@/components/gradient-text"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VinylRecord } from "@/components/vinyl-record"
import { useTracksStore } from "@/store/tracks"
import { Play, Pause, Heart, MessageCircle, Share2, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAccount } from "wagmi"
import { useTranslation } from "@/lib/i18n"

export default function ListenPage() {
    const { tracks } = useTracksStore()
    const { address, isConnected } = useAccount()
    const { t } = useTranslation()
    const [currentTrack, setCurrentTrack] = useState<any | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    // Genre list with translations
    const GENRES = [
        { key: "all", label: t.listen.genres.all },
        { key: "Hip-Hop", label: t.listen.genres.hiphop },
        { key: "Electronic", label: t.listen.genres.electronic },
        { key: "Rock", label: t.listen.genres.rock },
        { key: "Pop", label: t.listen.genres.pop },
        { key: "R&B", label: t.listen.genres.rnb },
        { key: "Jazz", label: t.listen.genres.jazz },
        { key: "Indie", label: t.listen.genres.indie },
    ]

    const [selectedGenre, setSelectedGenre] = useState("all")

    const filteredTracks = selectedGenre === "all" ? tracks : tracks.filter((track) => track.genre === selectedGenre)

    const handlePlayTrack = (track: any) => {
        if (currentTrack?.id === track.id) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentTrack(track)
            setIsPlaying(true)
        }
    }

    return (
        <PageShell>
            <div className="min-h-screen pb-32">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-mint/10 via-transparent to-transparent" />
                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-4xl mx-auto text-center space-y-6">
                            <h1 className="text-5xl md:text-7xl font-bold">
                                <GradientText>{t.listen.title}</GradientText>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.listen.subtitle}</p>
                            {!isConnected && <p className="text-sm text-muted-foreground">{t.listen.connectWallet}</p>}
                        </div>
                    </div>
                </section>

                {/* Genre Filter */}
                <section className="container mx-auto px-4 mb-12">
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                        {GENRES.map((genre) => (
                            <Button
                                key={genre.key}
                                variant={selectedGenre === genre.key ? "default" : "outline"}
                                onClick={() => setSelectedGenre(genre.key)}
                                className={
                                    selectedGenre === genre.key
                                        ? "bg-mint text-black hover:bg-mint/90"
                                        : "bg-white/5 border-white/10 hover:bg-white/10"
                                }
                            >
                                {genre.label}
                            </Button>
                        ))}
                    </div>
                </section>

                {/* Tracks Grid with Vinyl Records */}
                <section className="container mx-auto px-4">
                    {filteredTracks.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground text-lg">{t.listen.noTracks}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {filteredTracks.map((track) => (
                                <Card key={track.id} className="glass-card glass-hover group cursor-pointer" onClick={() => handlePlayTrack(track)}>
                                    <CardContent className="p-0">
                                        {/* Vinyl Record */}
                                        <div className="relative aspect-square overflow-hidden rounded-t-lg p-4 bg-gradient-to-br from-black/40 to-black/80">
                                            <VinylRecord
                                                coverUrl={track.coverUrl || "/placeholder.svg"}
                                                isPlaying={currentTrack?.id === track.id && isPlaying}
                                                size="md"
                                                className="mx-auto"
                                            />
                                            {/* Now Playing Badge */}
                                            {currentTrack?.id === track.id && isPlaying && (
                                                <div className="absolute top-6 right-6">
                                                    <Badge className="bg-mint text-black">{t.listen.playing}</Badge>
                                                </div>
                                            )}
                                        </div>

                                        {/* Track Info */}
                                        <div className="p-4 space-y-2">
                                            <h3 className="font-semibold text-white truncate">{track.title}</h3>
                                            <Link
                                                href={`/artist/${track.artist}`}
                                                className="text-sm text-muted-foreground hover:text-mint transition-colors truncate block"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {track.artist}
                                            </Link>

                                            {/* Social Stats */}
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
                                                <div className="flex items-center gap-1">
                                                    <Heart className="w-3 h-3" />
                                                    <span>{track.like_count || 0}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageCircle className="w-3 h-3" />
                                                    <span>{track.comment_count || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Persistent Audio Player */}
            {currentTrack && (
                <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between gap-4">
                            {/* Track Info with Vinyl */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="relative w-14 h-14 flex-shrink-0">
                                    <VinylRecord coverUrl={currentTrack.coverUrl || "/placeholder.svg"} isPlaying={isPlaying} size="sm" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-white truncate">{currentTrack.title}</h4>
                                    <Link href={`/artist/${currentTrack.artist}`} className="text-sm text-muted-foreground hover:text-mint">
                                        {currentTrack.artist}
                                    </Link>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-12 h-12 rounded-full bg-mint text-black hover:bg-mint/90"
                                >
                                    {isPlaying ? <Pause className="w-5 h-5" fill="black" /> : <Play className="w-5 h-5 ml-0.5" fill="black" />}
                                </Button>
                            </div>

                            {/* Actions */}
                            <div className="hidden md:flex items-center gap-2">
                                <Button variant="ghost" size="icon" disabled={!isConnected} className="hover:text-mint">
                                    <Heart className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" disabled={!isConnected} className="hover:text-mint">
                                    <MessageCircle className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:text-mint">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="sm" disabled={!isConnected} className="bg-mint/10 border-mint/20 hover:bg-mint/20">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    {t.social.tipArtist}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageShell>
    )
}
