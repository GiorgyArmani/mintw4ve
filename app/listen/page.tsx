"use client"

import { useState, useEffect, useRef } from "react"
import { PageShell } from "@/components/page-shell"
import { GradientText } from "@/components/gradient-text"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { VinylRecord } from "@/components/vinyl-record"
import { useTracksStore } from "@/store/tracks"
import { useEarningsStore } from "@/store/earnings"
import { Play, Pause, Heart, MessageCircle, Share2, DollarSign, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import Link from "next/link"
import { useAccount } from "wagmi"
import { useTranslation } from "@/lib/i18n"
import { toast } from "sonner"

export default function ListenPage() {
    const { tracks } = useTracksStore()
    const { address, isConnected } = useAccount()
    const { t } = useTranslation()
    const { awardStreamEarnings } = useEarningsStore()

    const [currentTrack, setCurrentTrack] = useState<any | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.7)
    const [isMuted, setIsMuted] = useState(false)
    const [hasEarnedForCurrentTrack, setHasEarnedForCurrentTrack] = useState(false)

    const audioRef = useRef<HTMLAudioElement>(null)

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

    // Check if current track belongs to the connected user
    const isOwnTrack = currentTrack && address && currentTrack.artist.toLowerCase() === address.toLowerCase()

    // Handle audio element updates
    useEffect(() => {
        if (!audioRef.current) return

        const audio = audioRef.current

        // Load new track
        if (currentTrack) {
            audio.src = currentTrack.audioUrl
            audio.volume = volume
            if (isPlaying) {
                audio.play().catch(error => {
                    console.error('Failed to play audio:', error)
                    toast.error('Failed to play track')
                    setIsPlaying(false)
                })
            }
        }
    }, [currentTrack])

    // Handle play/pause state
    useEffect(() => {
        if (!audioRef.current) return

        const audio = audioRef.current

        if (isPlaying) {
            audio.play().catch(error => {
                console.error('Failed to play audio:', error)
                toast.error('Failed to play track')
                setIsPlaying(false)
            })
        } else {
            audio.pause()
        }
    }, [isPlaying])

    // Handle volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume
        }
    }, [volume, isMuted])

    // Audio event handlers
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)

            // Award tokens after 30 seconds of listening (Stream2Earn)
            // BUT NOT if listening to own track
            if (
                !hasEarnedForCurrentTrack &&
                audioRef.current.currentTime >= 30 &&
                currentTrack &&
                !isOwnTrack
            ) {
                setHasEarnedForCurrentTrack(true)
                const earned = awardStreamEarnings(currentTrack.id, currentTrack.artist)
                if (isConnected) {
                    toast.success(`🎵 You earned ${earned} $MINT for listening!`, {
                        description: `Keep discovering music to earn more tokens`
                    })
                }
            }

            // Show different message if listening to own track
            if (
                !hasEarnedForCurrentTrack &&
                audioRef.current.currentTime >= 30 &&
                currentTrack &&
                isOwnTrack
            ) {
                setHasEarnedForCurrentTrack(true)
                toast.info('🎧 Previewing your own track', {
                    description: 'You cannot earn $MINT from your own music'
                })
            }
        }
    }

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const handleEnded = () => {
        setIsPlaying(false)
        setHasEarnedForCurrentTrack(false)
        // Auto-play next track
        playNextTrack()
    }

    const handlePlayTrack = (track: any) => {
        if (currentTrack?.id === track.id) {
            setIsPlaying(!isPlaying)
        } else {
            setCurrentTrack(track)
            setIsPlaying(true)
            setHasEarnedForCurrentTrack(false)
            setCurrentTime(0)

            // Show preview badge if it's user's own track
            if (address && track.artist.toLowerCase() === address.toLowerCase()) {
                toast.info('🎧 Playing your track', {
                    description: 'Preview mode - no earnings for own music',
                    duration: 3000
                })
            }
        }
    }

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0]
            setCurrentTime(value[0])
        }
    }

    const playNextTrack = () => {
        if (!currentTrack) return
        const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id)
        if (currentIndex < filteredTracks.length - 1) {
            handlePlayTrack(filteredTracks[currentIndex + 1])
        }
    }

    const playPreviousTrack = () => {
        if (!currentTrack) return
        const currentIndex = filteredTracks.findIndex(t => t.id === currentTrack.id)
        if (currentIndex > 0) {
            handlePlayTrack(filteredTracks[currentIndex - 1])
        }
    }

    const formatTime = (seconds: number) => {
        if (isNaN(seconds)) return '0:00'
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <PageShell>
            <div className="min-h-screen pb-32">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-mint/10 via-transparent to-transparent" />
                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-4xl mx-auto text-center space-y-4 md:space-y-6">
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold">
                                <GradientText>{t.listen.title}</GradientText>
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">{t.listen.subtitle}</p>
                            {!isConnected && <p className="text-xs sm:text-sm text-muted-foreground px-4">{t.listen.connectWallet}</p>}
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
                            {filteredTracks.map((track) => {
                                const isUserTrack = address && track.artist.toLowerCase() === address.toLowerCase()

                                return (
                                    <Card key={track.id} className="glass-card glass-hover group cursor-pointer" onClick={() => handlePlayTrack(track)}>
                                        <CardContent className="p-0">
                                            {/* Vinyl Record */}
                                            <div className="relative aspect-square overflow-hidden rounded-t-lg p-2 sm:p-4 bg-gradient-to-br from-black/40 to-black/80">
                                                <VinylRecord
                                                    coverUrl={track.coverUrl || "/placeholder.svg"}
                                                    isPlaying={currentTrack?.id === track.id && isPlaying}
                                                    size="md"
                                                    className="mx-auto w-full h-full"
                                                />
                                                {/* Now Playing Badge */}
                                                {currentTrack?.id === track.id && isPlaying && (
                                                    <div className="absolute top-2 right-2 sm:top-6 sm:right-6">
                                                        <Badge className="bg-mint text-black text-xs">
                                                            {isUserTrack ? 'Preview' : t.listen.playing}
                                                        </Badge>
                                                    </div>
                                                )}
                                                {/* Your Track Badge */}
                                                {isUserTrack && currentTrack?.id !== track.id && (
                                                    <div className="absolute top-2 right-2 sm:top-6 sm:right-6">
                                                        <Badge className="bg-violet/80 text-white text-xs">
                                                            Your Track
                                                        </Badge>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Track Info */}
                                            <div className="p-2 sm:p-4 space-y-1 sm:space-y-2">
                                                <h3 className="font-semibold text-white truncate text-sm sm:text-base">{track.title}</h3>
                                                <Link
                                                    href={`/artist/${track.artist}`}
                                                    className="text-xs sm:text-sm text-muted-foreground hover:text-mint transition-colors truncate block"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {isUserTrack ? 'You' : track.artist}
                                                </Link>

                                                {/* Social Stats */}
                                                <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground pt-1 sm:pt-2">
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
                                )
                            })}
                        </div>
                    )}
                </section>
            </div>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                preload="metadata"
            />

            {/* Persistent Audio Player */}
            {currentTrack && (
                <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
                    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
                        {/* Progress Bar */}
                        <div className="mb-2">
                            <Slider
                                value={[currentTime]}
                                max={duration || 100}
                                step={0.1}
                                onValueChange={handleSeek}
                                className="w-full cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                            {/* Track Info with Vinyl */}
                            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                                    <VinylRecord coverUrl={currentTrack.coverUrl || "/placeholder.svg"} isPlaying={isPlaying} size="sm" />
                                    {/* Preview Mode Indicator */}
                                    {isOwnTrack && (
                                        <div className="absolute -top-1 -right-1">
                                            <Badge className="bg-violet/80 text-white text-[10px] px-1 py-0">
                                                PREVIEW
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-white truncate text-sm sm:text-base">
                                        {currentTrack.title}
                                        {isOwnTrack && (
                                            <span className="text-muted-foreground ml-2 text-xs">(Your track)</span>
                                        )}
                                    </h4>
                                    <Link href={`/artist/${currentTrack.artist}`} className="text-xs sm:text-sm text-muted-foreground hover:text-mint truncate block">
                                        {isOwnTrack ? 'You' : currentTrack.artist}
                                    </Link>
                                </div>
                            </div>

                            {/* Playback Controls */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={playPreviousTrack}
                                    className="w-8 h-8 sm:w-10 sm:h-10 hover:text-mint"
                                    disabled={filteredTracks.findIndex(t => t.id === currentTrack.id) === 0}
                                >
                                    <SkipBack className="w-4 h-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-mint text-black hover:bg-mint/90 flex-shrink-0"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" fill="black" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" fill="black" />}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={playNextTrack}
                                    className="w-8 h-8 sm:w-10 sm:h-10 hover:text-mint"
                                    disabled={filteredTracks.findIndex(t => t.id === currentTrack.id) === filteredTracks.length - 1}
                                >
                                    <SkipForward className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Volume Control - Hidden on mobile */}
                            <div className="hidden md:flex items-center gap-2 w-32">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="w-8 h-8 hover:text-mint"
                                >
                                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </Button>
                                <Slider
                                    value={[isMuted ? 0 : volume * 100]}
                                    max={100}
                                    step={1}
                                    onValueChange={(value) => {
                                        setVolume(value[0] / 100)
                                        setIsMuted(false)
                                    }}
                                    className="w-full"
                                />
                            </div>

                            {/* Actions - Hidden on mobile */}
                            <div className="hidden lg:flex items-center gap-2">
                                <Button variant="ghost" size="icon" disabled={!isConnected || isOwnTrack} className="hover:text-mint">
                                    <Heart className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" disabled={!isConnected} className="hover:text-mint">
                                    <MessageCircle className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="hover:text-mint">
                                    <Share2 className="w-5 h-5" />
                                </Button>
                                {!isOwnTrack && (
                                    <Button variant="outline" size="sm" disabled={!isConnected} className="bg-mint/10 border-mint/20 hover:bg-mint/20">
                                        <DollarSign className="w-4 h-4 mr-1" />
                                        {t.social.tipArtist}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageShell>
    )
}