"use client"

import type React from "react"

import { useState } from "react"
import { useAccount } from "wagmi"
import { PageShell } from "@/components/page-shell"
import { GradientText } from "@/components/gradient-text"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useOrdersStore, type Order } from "@/store/orders"
import { useWalletStore } from "@/store/wallet"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  description: string
  priceRange: string
  serviceType: Order["serviceType"]
  gradient: string
}

function ServiceCard({ icon, title, description, priceRange, serviceType, gradient }: ServiceCardProps) {
  const { address } = useAccount()
  const [isOpen, setIsOpen] = useState(false)
  const [orderDescription, setOrderDescription] = useState("")
  const [priceMint, setPriceMint] = useState("")
  const [error, setError] = useState("")

  const addOrder = useOrdersStore((state) => state.addOrder)
  const mockMintBalance = useWalletStore((state) => state.mockMintBalance)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!orderDescription || !priceMint) {
      setError("All fields are required")
      return
    }

    const price = Number.parseFloat(priceMint)
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price")
      return
    }

    if (price > Number.parseFloat(mockMintBalance)) {
      setError(`Insufficient balance. You have ${mockMintBalance} $MINT`)
      return
    }

    // Create order
    const newOrder: Order = {
      id: Math.random().toString(36).substring(7),
      artistWallet: address || "0x0000000000000000000000000000000000000000",
      serviceType,
      description: orderDescription,
      priceMint: price.toFixed(2),
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    addOrder(newOrder)

    // Reset form and close
    setOrderDescription("")
    setPriceMint("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] border-2">
          <CardContent className="pt-6 space-y-4">
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}
            >
              {icon}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Badge variant="outline" className="text-xs">
                {priceRange}
              </Badge>
              <Button variant="ghost" size="sm">
                Order Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order {title}</DialogTitle>
          <DialogDescription>Describe what you need and set your budget in $MINT tokens.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your project and what you need..."
              rows={4}
              value={orderDescription}
              onChange={(e) => setOrderDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($MINT)</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={priceMint}
              onChange={(e) => setPriceMint(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Your balance: {mockMintBalance} $MINT</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Order
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default function MarketplacePage() {
  const mockMintBalance = useWalletStore((state) => state.mockMintBalance)

  const services: ServiceCardProps[] = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
      title: "Beats & Instrumentals",
      description: "Get custom beats, instrumentals, and production from talented producers in the community.",
      priceRange: "10-100 $MINT",
      serviceType: "beats",
      gradient: "from-mint to-cyan",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Cover Art & Design",
      description: "Commission album covers, single art, and visual designs from creative artists.",
      priceRange: "5-50 $MINT",
      serviceType: "cover-art",
      gradient: "from-cyan to-violet",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      ),
      title: "Mixing & Mastering",
      description: "Professional mixing and mastering services from experienced audio engineers.",
      priceRange: "20-150 $MINT",
      serviceType: "mixing",
      gradient: "from-violet to-mint",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      ),
      title: "Video Editing",
      description: "Music videos, lyric videos, and promotional content from skilled video editors.",
      priceRange: "30-200 $MINT",
      serviceType: "video-editing",
      gradient: "from-mint via-cyan to-violet",
    },
  ]

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-6 text-center">
            <Badge variant="outline">Artist Marketplace</Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Spend <GradientText>$MINT</GradientText> on Services
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get beats, cover art, mixing, video editing and more from other artists using the $MINT token.
            </p>

            {/* Balance Display */}
            <Card className="max-w-md mx-auto border-2">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                  <p className="text-4xl font-bold text-gradient">{mockMintBalance} $MINT</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.serviceType} {...service} />
            ))}
          </div>

          {/* Info Section */}
          <Card className="border-mint/30">
            <CardHeader>
              <CardTitle>How the Marketplace Works</CardTitle>
              <CardDescription>A decentralized economy powered by artists, for artists</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">For Buyers</h4>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Choose a service you need</li>
                    <li>Describe your project requirements</li>
                    <li>Set your budget in $MINT tokens</li>
                    <li>Artists will reach out to fulfill your order</li>
                    <li>Pay with $MINT when satisfied</li>
                  </ol>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">For Sellers</h4>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Browse available orders in your expertise</li>
                    <li>Contact buyers with your portfolio</li>
                    <li>Deliver high-quality work</li>
                    <li>Receive $MINT payment directly</li>
                    <li>Build your reputation in the community</li>
                  </ol>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-xs">
                  <strong>Note:</strong> The marketplace is currently in beta. Full peer-to-peer messaging and escrow
                  features will be added in future updates. For now, orders are tracked in your dashboard and you can
                  coordinate off-platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-mint/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Instant Transactions</h3>
                <p className="text-sm text-muted-foreground">
                  Pay and receive $MINT instantly on the blockchain. No waiting for bank transfers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-cyan/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">No Middlemen</h3>
                <p className="text-sm text-muted-foreground">
                  Direct artist-to-artist transactions. No platform fees or intermediaries taking cuts.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-violet/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Support fellow artists while getting the services you need. Everyone wins.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
