"use client"

import { useState } from "react"
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWalletStore } from "@/store/wallet"
import { Music, Mic2, Image as ImageIcon, Search, ShoppingCart, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { GradientText } from "@/components/gradient-text"

const SERVICES = [
  {
    id: "beat-1",
    title: "Trap Soul Beat",
    provider: "ProducerX",
    price: "50",
    rating: 4.8,
    reviews: 12,
    type: "beat",
    image: "/placeholder.svg?height=200&width=200",
    description: "Hard hitting 808s with soulful melodies. Perfect for trap and R&B artists.",
  },
  {
    id: "beat-2",
    title: "Lofi Chill",
    provider: "ChillWave",
    price: "30",
    rating: 4.5,
    reviews: 8,
    type: "beat",
    image: "/placeholder.svg?height=200&width=200",
    description: "Relaxing lofi beats for studying or chilling. Smooth jazz samples.",
  },
  {
    id: "art-1",
    title: "Cyberpunk Cover",
    provider: "VisualArt",
    price: "40",
    rating: 5.0,
    reviews: 5,
    type: "art",
    image: "/placeholder.svg?height=200&width=200",
    description: "Futuristic cyberpunk style album cover art. High resolution delivery.",
  },
  {
    id: "mix-1",
    title: "Pro Mixing",
    provider: "AudioEng",
    price: "100",
    rating: 4.9,
    reviews: 20,
    type: "mixing",
    image: "/placeholder.svg?height=200&width=200",
    description: "Professional mixing service. Vocal tuning, EQ, compression and more.",
  },
  {
    id: "beat-3",
    title: "Drill Anthem",
    provider: "DrillMaster",
    price: "60",
    rating: 4.7,
    reviews: 15,
    type: "beat",
    image: "/placeholder.svg?height=200&width=200",
    description: "Aggressive drill beat with sliding 808s and dark melodies.",
  },
  {
    id: "art-2",
    title: "Abstract Vibes",
    provider: "CreativeMind",
    price: "35",
    rating: 4.6,
    reviews: 10,
    type: "art",
    image: "/placeholder.svg?height=200&width=200",
    description: "Abstract and colorful album art to make your track stand out.",
  },
]

export default function MarketPage() {
  const { mockWaveBalance, addToBalance } = useWalletStore()
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredServices = SERVICES.filter((service) => {
    const matchesFilter = filter === "all" || service.type === filter
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handlePurchase = (service: typeof SERVICES[0]) => {
    // In a real app, this would deduct balance
    // For this mock, we'll just show a success message
    if (Number(mockWaveBalance) < Number(service.price)) {
      alert("Insufficient balance. You need more $WAVE tokens to purchase this item.")
      return
    }

    // Simulate purchase
    addToBalance(`-${service.price}`)
    alert(`Purchase successful! You purchased ${service.title} for ${service.price} WAVE`)
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">
              <GradientText>Marketplace</GradientText>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Discover beats, cover art, and services from the community.
              Use your $WAVE tokens to purchase.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <span className="text-sm text-muted-foreground">Your Balance:</span>
            <span className="font-bold text-mint">{mockWaveBalance} WAVE</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for beats, artists, or services..."
              className="pl-10 bg-white/5 border-white/10 focus:border-mint/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" value={filter} onValueChange={setFilter} className="w-full md:w-auto">
            <TabsList className="bg-white/5 border border-white/10 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="beat">Beats</TabsTrigger>
              <TabsTrigger value="art">Art</TabsTrigger>
              <TabsTrigger value="mixing">Services</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <Card key={service.id} className="glass-card glass-hover border-white/5 overflow-hidden flex flex-col">
                <div className="aspect-square relative bg-gradient-to-br from-gray-900 to-black">
                  {/* Placeholder for image */}
                  <div className="absolute inset-0 flex items-center justify-center text-white/10">
                    {service.type === "beat" && <Music className="w-20 h-20" />}
                    {service.type === "art" && <ImageIcon className="w-20 h-20" />}
                    {service.type === "mixing" && <Mic2 className="w-20 h-20" />}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur-md border-white/10 text-white">
                      {service.type === "beat" && "Beat"}
                      {service.type === "art" && "Art"}
                      {service.type === "mixing" && "Service"}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                      <CardDescription className="text-mint mt-1">by {service.provider}</CardDescription>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      {service.rating}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                </CardContent>

                <CardFooter className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div className="font-bold text-xl text-white">
                    {service.price} <span className="text-sm font-normal text-mint">WAVE</span>
                  </div>
                  <Button
                    onClick={() => handlePurchase(service)}
                    className="bg-white text-black hover:bg-mint hover:text-black transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageShell>
  )
}
