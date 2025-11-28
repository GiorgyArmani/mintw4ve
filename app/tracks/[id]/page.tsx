"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { useAccount } from "wagmi"
import { PageShell } from "@/components/page-shell"
import { GradientText } from "@/components/gradient-text"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTracksStore } from "@/store/tracks"
import { useEarningsStore } from "@/store/earnings"
import { Play, Pause, Heart, Share2, Music, Loader2, MessageCircle } from "lucide-react"
import { VinylRecord } from "@/components/vinyl-record"
import { CommentSection } from "@/components/comment-section"
import Image from "next/image"
import { toast } from "sonner"

export default function TrackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { address, isConnected } = useAccount()
  const { tracks, fetchTracks, isLoading } = useTracksStore()
  const { awardStreamEarnings, getEarningsByTrack } = useEarningsStore()

  const [isPlaying, setIsPlaying] = useState(false)
  const [hasEarned, setHasEarned] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Fetch tracks if not loaded
  useEffect(() => {
    if (tracks.length === 0) {
      fetchTracks()
    }
  }, [tracks.length, fetchTracks])

  // Find the track
  const track = tracks.find(t => t.id === id)

  // Check if it's user's own track
  const isOwnTrack = track && address && track.artist.toLowerCase() === address.toLowerCase()

  // Get earnings for this track
  const trackEarnings = track ? getEarningsByTrack(track.id) : []
  const totalEarnings = trackEarnings.reduce((sum, e) => sum + e.amount, 0)

  // Initialize audio
  useEffect(() => {
    if (track && !audioElement) {
      const audio = new Audio(track.audioUrl)
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', () => setIsPlaying(false))
      setAudioElement(audio)

      return () => {
        audio.pause()
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', () => setIsPlaying(false))
      }
    }
  }, [track])

  const handleTimeUpdate = () => {
    if (!audioElement || !track || hasEarned || isOwnTrack) return

    // Award after 30 seconds
    if (audioElement.currentTime >= 30) {
      setHasEarned(true)
      const earned = awardStreamEarnings(track.id, track.artist)

      if (isConnected) {
        toast.success(`🎵 You earned ${earned} $MINT!`, {
          description: 'Keep listening to earn more tokens'
        })
      }
    }
  }

  const togglePlay = () => {
    if (!audioElement) return

    if (isPlaying) {
      audioElement.pause()
      setIsPlaying(false)
    } else {
      audioElement.play()
      setIsPlaying(true)

      if (isOwnTrack) {
        toast.info('🎧 Previewing your track', {
          description: 'You cannot earn from your own music'
        })
      }
    }
  }

  if (isLoading) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-mint animate-spin" />
          <p className="text-muted-foreground">Loading track...</p>
        </div>
      </PageShell>
    )
  }

  if (!track) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-mint/10 flex items-center justify-center mx-auto mb-4">
            <Music className="w-8 h-8 text-mint" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Track Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The track you're looking for doesn't exist or hasn't been uploaded yet.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/listen">Browse Tracks</Link>
            </Button>
            <Button asChild className="bg-mint text-black hover:bg-mint/90">
              <Link href="/upload">Upload Music</Link>
            </Button>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Cover Art & Vinyl */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-2 glass-card">
              <div className="aspect-square relative bg-gradient-to-br from-black/40 to-black/80 p-8">
                <VinylRecord
                  coverUrl={track.coverUrl || "/placeholder.svg"}
                  isPlaying={isPlaying}
                  size="lg"
                  className="w-full h-full"
                />
                {isOwnTrack && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-violet/80 text-white">Your Track</Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="glass-card">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-mint to-cyan bg-clip-text text-transparent">
                    {track.playCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Total Plays</div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-mint to-cyan bg-clip-text text-transparent">
                    {totalEarnings.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">$MINT Earned</div>
                </CardContent>
              </Card>
            </div>

            {/* Play Button */}
            <Button
              onClick={togglePlay}
              className="w-full bg-mint text-black hover:bg-mint/90"
              size="lg"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" fill="black" />
                  Pause Track
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" fill="black" />
                  Play Track
                </>
              )}
            </Button>

            {hasEarned && !isOwnTrack && (
              <Card className="glass-card border-mint/20">
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-center">
                    <span className="font-semibold text-mint">🎵 Stream2Earn Active!</span>
                    <br />
                    <span className="text-muted-foreground text-xs">
                      You're earning $MINT tokens while listening
                    </span>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Track Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge className="bg-mint/20 text-mint border-mint/30">{track.genre}</Badge>

              <h1 className="text-4xl md:text-5xl font-bold">
                <GradientText>{track.title}</GradientText>
              </h1>

              <Link
                href={`/artist/${track.artist}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-mint transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-mono text-sm">
                  {isOwnTrack ? 'You' : track.artist}
                </span>
              </Link>

              {track.description && (
                <p className="text-muted-foreground leading-relaxed">{track.description}</p>
              )}
            </div>

            {/* NFT Info */}
            <Card className="glass-card">
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Music className="w-5 h-5 text-mint" />
                  NFT Information
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token ID</span>
                    <span className="font-mono">{track.tokenId || "Not minted"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner</span>
                    <span className="font-mono text-xs truncate max-w-[200px]">
                      {track.artist}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date(track.createdAt).toLocaleDateString()}</span>
                  </div>

                  {track.metadataUri && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Metadata URI</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs font-mono hover:text-mint"
                        onClick={() => {
                          navigator.clipboard.writeText(track.metadataUri!)
                          toast.success('Metadata URI copied!')
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Actions */}
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="bg-transparent hover:bg-mint/10 hover:text-mint"
                    disabled={!isConnected || isOwnTrack}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-transparent hover:bg-mint/10 hover:text-mint"
                    onClick={() => {
                      const url = window.location.href
                      navigator.clipboard.writeText(url)
                      toast.success('Link copied to clipboard!')
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card className="glass-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-mint" />
                  Comments
                </h3>
                <CommentSection trackId={track.id} initialCommentCount={track.comment_count} />
              </CardContent>
            </Card>

            {/* Navigation Actions */}
            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/listen">Browse More</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}