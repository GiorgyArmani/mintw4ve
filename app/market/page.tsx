"use client"

import { useState, useEffect } from "react"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWalletStore } from "@/store/wallet"
import { Search, Plus } from "lucide-react"
import { GradientText } from "@/components/gradient-text"
import { ServiceForm } from "@/components/market/service-form"
import { RequestForm } from "@/components/market/request-form"
import { ServiceCard, type Service } from "@/components/market/service-card"
import { RequestCard, type Request } from "@/components/market/request-card"
import { toast } from "sonner"

export default function MarketPage() {
  const { mockWaveBalance, addToBalance } = useWalletStore()
  const [activeTab, setActiveTab] = useState("services")
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [services, setServices] = useState<Service[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchServices = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== "all") params.append("type", filter)
      if (searchQuery) params.append("search", searchQuery)

      const res = await fetch(`/api/market/services?${params.toString()}`)
      const data = await res.json()
      if (data.services) setServices(data.services)
    } catch (error) {
      console.error("Failed to fetch services", error)
    }
  }

  const fetchRequests = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== "all") params.append("type", filter)

      const res = await fetch(`/api/market/requests?${params.toString()}`)
      const data = await res.json()
      if (data.requests) setRequests(data.requests)
    } catch (error) {
      console.error("Failed to fetch requests", error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    Promise.all([fetchServices(), fetchRequests()]).finally(() => setIsLoading(false))
  }, [filter, searchQuery]) // Re-fetch when filter/search changes

  const handlePurchase = (service: Service) => {
    if (Number(mockWaveBalance) < service.price) {
      toast.error("Insufficient balance. You need more $WAVE tokens.")
      return
    }

    addToBalance(`-${service.price}`)
    toast.success(`Purchase successful! You purchased ${service.title}`)
    // In real app, create a purchase record in DB
  }

  const handleChat = (username: string) => {
    toast.info(`Starting chat with ${username}... (Chat feature coming soon)`)
    // In real app, redirect to /chat?user=username or open chat modal
  }

  const handleContact = (username: string) => {
    toast.info(`Contacting ${username}... (Chat feature coming soon)`)
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

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
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

          <div className="flex gap-2">
            <ServiceForm onSuccess={fetchServices} />
            <RequestForm onSuccess={fetchRequests} />
          </div>
        </div>

        {/* Content */}
        <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-transparent border-b border-white/10 w-full justify-start rounded-none h-auto p-0 mb-8">
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-mint data-[state=active]:text-mint rounded-none px-6 py-3 text-lg"
            >
              Services
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-mint data-[state=active]:text-mint rounded-none px-6 py-3 text-lg"
            >
              Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-0">
            {isLoading ? (
              <div className="text-center py-20 text-muted-foreground">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No services found</h3>
                <p className="text-muted-foreground">Be the first to list a service!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onChat={handleChat}
                    onBuy={handlePurchase}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-0">
            {isLoading ? (
              <div className="text-center py-20 text-muted-foreground">Loading requests...</div>
            ) : requests.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No requests found</h3>
                <p className="text-muted-foreground">Post a request to find what you need.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onContact={handleContact}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  )
}
