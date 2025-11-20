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
import Link from "next/link"
import { Play, TrendingUp, DollarSign, Music, Users, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { GradientText } from "@/components/gradient-text"

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { tracks } = useTracksStore()
  const { mockWaveBalance } = useWalletStore()
  const [userTracks, setUserTracks] = useState<any[]>([])
  const [userEmail, setUserEmail] = useState<string>("")
  const [stats, setStats] = useState({
    totalPlays: 0,
    totalEarnings: "0",
    totalTracks: 0,
    avgPlaysPerTrack: 0,
  })

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setUserEmail(user.email)
    }
    getUser()
  }, [])

  useEffect(() => {
    if (address) {
      // Filter tracks owned by current user
      const myTracks = tracks.filter((track) => track.artist.toLowerCase() === address.toLowerCase())
      setUserTracks(myTracks)

      // Calculate stats
      const totalPlays = myTracks.reduce((sum, track) => sum + track.plays, 0)
      const totalEarnings = myTracks.reduce(
        (sum, track) => sum + track.plays * 10, // 10 WAVE per play
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
        <div className="container mx-auto px-4 py-32">
          <Card className="max-w-md mx-auto text-center glass-card border-mint/20">
            <CardContent className="pt-12 pb-12 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-mint to-violet flex items-center justify-center shadow-lg shadow-mint/20 animate-pulse">
                <Music className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Connect Your Wallet</h1>
                <p className="text-muted-foreground">
                  Connect your wallet to view your dashboard, track analytics, and manage your music.
                </p>
              </div>
              <div className="pt-4 flex justify-center">
                <ConnectButton />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome back, <GradientText>{userEmail.split('@')[0] || 'Artist'}</GradientText>
            </h1>
            <p className="text-xl text-muted-foreground">Here's what's happening with your music today.</p>
          </div>
          <Button asChild size="lg" className="bg-mint text-black hover:bg-mint/90 shadow-lg shadow-mint/20">
            <Link href="/upload">
              <Music className="w-4 h-4 mr-2" />
              Upload New Track
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="glass-card border-mint/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-mint" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalEarnings} <span className="text-sm font-normal text-mint">WAVE</span></div>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ${(Number.parseFloat(stats.totalEarnings) * 0.1).toFixed(2)} USD
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-cyan/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Plays</CardTitle>
              <Play className="h-4 w-4 text-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalPlays.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all tracks</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-violet/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Your Tracks</CardTitle>
              <Music className="h-4 w-4 text-violet" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalTracks}</div>
              <p className="text-xs text-muted-foreground mt-1">Total uploaded</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Plays/Track</CardTitle>
              <TrendingUp className="h-4 w-4 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.avgPlaysPerTrack}</div>
              <p className="text-xs text-muted-foreground mt-1">Per track average</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="tracks" className="space-y-8">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="tracks" className="data-[state=active]:bg-mint data-[state=active]:text-black">Your Tracks</TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-mint data-[state=active]:text-black">Earnings</TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-mint data-[state=active]:text-black">Wallet</TabsTrigger>
          </TabsList>

          {/* Your Tracks Tab */}
          <TabsContent value="tracks" className="space-y-6">
            {userTracks.length === 0 ? (
              <Card className="glass-card border-dashed border-2 border-white/10">
                <CardContent className="py-20">
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center">
                      <Music className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold">No tracks yet</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Upload your first track to start earning $WAVE tokens from plays
                      </p>
                    </div>
                    <Button asChild className="bg-mint text-black hover:bg-mint/90">
                      <Link href="/upload">Upload Track</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {userTracks.map((track) => (
                  <Card key={track.id} className="glass-card glass-hover border-white/5 overflow-hidden group">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6">
                        {/* Track Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-xl truncate text-white group-hover:text-mint transition-colors">{track.title}</h3>
                            <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/5">{track.genre}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{track.description}</p>

                          <div className="flex flex-wrap items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-white/80">
                              <Play className="w-4 h-4 text-mint" />
                              <span className="font-medium">{track.plays}</span>
                              <span className="text-muted-foreground">plays</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                              <DollarSign className="w-4 h-4 text-mint" />
                              <span className="font-medium">{track.plays * 10}</span>
                              <span className="text-muted-foreground">WAVE earned</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/80">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {new Date(track.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <Button variant="outline" asChild className="flex-1 md:flex-none border-white/10 hover:bg-white/10 hover:text-white">
                            <Link href={`/tracks/${track.id}`}>View Details</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card className="glass-card border-mint/10">
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Your $WAVE token earnings from track plays</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 p-6 bg-gradient-to-br from-mint/10 to-transparent rounded-xl border border-mint/10">
                    <p className="text-sm text-mint mb-1">Total Earned</p>
                    <p className="text-4xl font-bold text-white">{stats.totalEarnings} WAVE</p>
                  </div>
                  <div className="flex-1 p-6 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-sm text-muted-foreground mb-1">Current Rate</p>
                    <p className="text-2xl font-bold text-white">10 WAVE <span className="text-sm font-normal text-muted-foreground">/ play</span></p>
                  </div>
                </div>

                {userTracks.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Earnings by Track</h4>
                    <div className="space-y-3">
                      {userTracks.map((track) => (
                        <div key={track.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded bg-mint/20 flex items-center justify-center text-mint">
                              <Music className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{track.title}</p>
                              <p className="text-sm text-muted-foreground">{track.plays} plays</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-mint">{track.plays * 10} WAVE</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle>Wallet Overview</CardTitle>
                <CardDescription>Manage your $WAVE tokens and wallet connection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Connected Address</p>
                    <div className="flex items-center gap-3">
                      <p className="font-mono text-sm bg-black/40 border border-white/10 px-4 py-2 rounded-lg text-mint">
                        {address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gradient-to-br from-violet/10 to-transparent rounded-xl border border-violet/10">
                      <p className="text-sm text-violet mb-1">Wallet Balance</p>
                      <p className="text-3xl font-bold text-white">{mockWaveBalance} WAVE</p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-mint/10 to-transparent rounded-xl border border-mint/10">
                      <p className="text-sm text-mint mb-1">Total Earned</p>
                      <p className="text-3xl font-bold text-white">{stats.totalEarnings} WAVE</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-8">
                  <h4 className="font-semibold mb-6">Use Your $WAVE</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button asChild variant="outline" className="h-auto py-4 justify-start bg-white/5 border-white/10 hover:bg-white/10 hover:border-mint/50 group">
                      <Link href="/market">
                        <div className="mr-4 p-2 rounded-lg bg-mint/10 text-mint group-hover:bg-mint group-hover:text-black transition-colors">
                          <Music className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-white">Buy Beats</div>
                          <div className="text-xs text-muted-foreground">Browse the marketplace</div>
                        </div>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-4 justify-start bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan/50 group">
                      <Link href="/market">
                        <div className="mr-4 p-2 rounded-lg bg-cyan/10 text-cyan group-hover:bg-cyan group-hover:text-black transition-colors">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-white">Hire Artists</div>
                          <div className="text-xs text-muted-foreground">Commission services</div>
                        </div>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto py-4 justify-start bg-white/5 border-white/10 hover:bg-white/10 hover:border-violet/50 group">
                      <Link href="/docs">
                        <div className="mr-4 p-2 rounded-lg bg-violet/10 text-violet group-hover:bg-violet group-hover:text-black transition-colors">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-white">Stake Tokens</div>
                          <div className="text-xs text-muted-foreground">Earn yield (Coming Soon)</div>
                        </div>
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  )
}
