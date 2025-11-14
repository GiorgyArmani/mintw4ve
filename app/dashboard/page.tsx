"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTracksStore } from "@/store/tracks"
import { useWalletStore } from "@/store/wallet"
import { formatEther } from "viem"
import Link from "next/link"
import { Play, TrendingUp, DollarSign, Music, Users, Calendar } from "lucide-react"

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { tracks } = useTracksStore()
  const { balance, earnings } = useWalletStore()
  const [userTracks, setUserTracks] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalPlays: 0,
    totalEarnings: "0",
    totalTracks: 0,
    avgPlaysPerTrack: 0,
  })

  useEffect(() => {
    if (address) {
      // Filter tracks owned by current user
      const myTracks = tracks.filter((track) => track.artist.toLowerCase() === address.toLowerCase())
      setUserTracks(myTracks)

      // Calculate stats
      const totalPlays = myTracks.reduce((sum, track) => sum + track.playCount, 0)
      const totalEarnings = myTracks.reduce(
        (sum, track) => sum + track.playCount * 10, // 10 MINT per play
        0,
      )
      const avgPlays = myTracks.length > 0 ? totalPlays / myTracks.length : 0

      setStats({
        totalPlays,
        totalEarnings: totalEarnings.toString(),
        totalTracks: myTracks.length,
        avgPlaysPerTrack: Math.round(avgPlays),
      })
    }
  }, [address, tracks])

  if (!isConnected) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-mint to-violet flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
            <p className="text-muted-foreground">
              Connect your wallet to view your dashboard, track analytics, and manage your music.
            </p>
          </div>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your music performance and earnings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEarnings} MINT</div>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ${(Number.parseFloat(stats.totalEarnings) * 0.1).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPlays.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all tracks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Your Tracks</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTracks}</div>
              <p className="text-xs text-muted-foreground mt-1">Total uploaded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Plays/Track</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgPlaysPerTrack}</div>
              <p className="text-xs text-muted-foreground mt-1">Per track average</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tracks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tracks">Your Tracks</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
          </TabsList>

          {/* Your Tracks Tab */}
          <TabsContent value="tracks" className="space-y-4">
            {userTracks.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <Music className="w-12 h-12 mx-auto text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No tracks yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Upload your first track to start earning $MINT tokens from plays
                    </p>
                    <Button asChild>
                      <Link href="/upload">Upload Track</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userTracks.map((track) => (
                  <Card key={track.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{track.title}</h3>
                            <Badge variant="secondary">{track.genre}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">{track.description}</p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Play className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{track.playCount}</span>
                              <span className="text-muted-foreground">plays</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{track.playCount * 10}</span>
                              <span className="text-muted-foreground">MINT earned</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {new Date(track.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <Link href={`/tracks/${track.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Your $MINT token earnings from track plays</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                      <p className="text-2xl font-bold">{stats.totalEarnings} MINT</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Rate</p>
                      <p className="text-lg font-semibold">10 MINT/play</p>
                    </div>
                  </div>

                  {userTracks.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold">Earnings by Track</h4>
                      {userTracks.map((track) => (
                        <div key={track.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{track.title}</p>
                            <p className="text-sm text-muted-foreground">{track.playCount} plays</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{track.playCount * 10} MINT</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">How to Earn More</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-mint">•</span>
                      <span>Upload more tracks to diversify your catalog</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-mint">•</span>
                      <span>Share your tracks on social media to increase plays</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-mint">•</span>
                      <span>Collaborate with other artists on the platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-mint">•</span>
                      <span>Engage with the community to build your audience</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Overview</CardTitle>
                <CardDescription>Manage your $MINT tokens and wallet connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Connected Address</p>
                    <p className="font-mono text-sm bg-muted p-2 rounded">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">MINT Balance</p>
                      <p className="text-2xl font-bold">{balance ? formatEther(balance) : "0"} MINT</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
                      <p className="text-2xl font-bold">{stats.totalEarnings} MINT</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Use Your $MINT</h4>
                  <div className="grid gap-3">
                    <Button asChild variant="outline" className="justify-start bg-transparent">
                      <Link href="/market">
                        <Music className="w-4 h-4 mr-2" />
                        Browse Marketplace
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start bg-transparent">
                      <Link href="/market">
                        <Users className="w-4 h-4 mr-2" />
                        Commission Services
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="justify-start bg-transparent">
                      <Link href="/docs">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Submit to Platforms
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    <strong>Note:</strong> This is a development preview using mock data. In production, all
                    transactions will be on Ethereum mainnet.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  )
}
