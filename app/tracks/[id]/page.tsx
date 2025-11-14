"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useAccount } from "wagmi"
import { PageShell } from "@/components/page-shell"
import { GradientText } from "@/components/gradient-text"
import { AudioPlayer } from "@/components/audio-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTracksStore } from "@/store/tracks"
import { useWalletStore } from "@/store/wallet"
import { mockAwardStreamEarnings } from "@/lib/mock/web3Mock"
import Image from "next/image"

export default function TrackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { address } = useAccount()
  const track = useTracksStore((state) => state.getTrack(id))
  const incrementPlays = useTracksStore((state) => state.incrementPlays)
  const addToBalance = useWalletStore((state) => state.addToBalance)

  const [hasPlayedOnce, setHasPlayedOnce] = useState(false)
  const [isAwarding, setIsAwarding] = useState(false)

  const handlePlay = async () => {
    if (!track || hasPlayedOnce || isAwarding) return

    setIsAwarding(true)

    try {
      // Award earnings
      const result = await mockAwardStreamEarnings(track.id, address || "0x0000000000000000000000000000000000000000")

      // Update track plays and earnings
      incrementPlays(track.id, result.earned)

      // Add to wallet balance
      addToBalance(result.earned)

      setHasPlayedOnce(true)
    } catch (error) {
      console.error("Failed to award earnings:", error)
    } finally {
      setIsAwarding(false)
    }
  }

  if (!track) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Track Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The track you're looking for doesn't exist or hasn't been minted yet.
          </p>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Cover Art */}
          <div className="space-y-6">
            <Card className="overflow-hidden border-2">
              <div className="aspect-square relative bg-muted">
                <Image
                  src={track.coverUrl || "/placeholder.svg"}
                  alt={track.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-gradient">{track.plays}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Plays</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-gradient">{track.earnings}</div>
                  <div className="text-sm text-muted-foreground mt-1">$MINT Earned</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Track Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Badge>{track.genre}</Badge>

              <h1 className="text-4xl md:text-5xl font-bold">
                <GradientText>{track.title}</GradientText>
              </h1>

              <div className="flex items-center gap-2 text-muted-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="font-mono text-sm">{track.artist}</span>
              </div>

              <p className="text-muted-foreground leading-relaxed">{track.description}</p>
            </div>

            {/* Audio Player */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <AudioPlayer src={track.audioUrl} title={track.title} onPlay={handlePlay} />

                {hasPlayedOnce && (
                  <div className="mt-4 p-3 bg-mint/10 border border-mint/20 rounded-lg">
                    <p className="text-sm text-center">
                      <span className="font-semibold text-mint">Stream2Earn Activated!</span>
                      <br />
                      <span className="text-muted-foreground">You're earning $MINT tokens while listening.</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* NFT Info */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold">NFT Information</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token ID</span>
                    <span className="font-mono">{track.tokenId || "Pending"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner</span>
                    <span className="font-mono">{track.artist}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minted</span>
                    <span>{new Date(track.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Metadata URI</span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs font-mono">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 bg-transparent">
                <Link href="/upload">Upload Another</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
