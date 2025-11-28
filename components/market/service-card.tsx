"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Music, Mic2, Image as ImageIcon, ShoppingCart, MessageCircle } from "lucide-react"
import Image from "next/image"

export interface Service {
    id: string
    title: string
    description: string
    price: number
    type: string
    cover_image: string
    preview_url: string
    seller_id: string
    seller: {
        username: string
        avatar_url: string
    }
    created_at: string
}

interface ServiceCardProps {
    service: Service
    onChat: (sellerId: string) => void
    onBuy: (service: Service) => void
}

export function ServiceCard({ service, onChat, onBuy }: ServiceCardProps) {
    return (
        <Card className="glass-card glass-hover border-white/5 overflow-hidden flex flex-col h-full group">
            <div className="aspect-square relative bg-gradient-to-br from-gray-900 to-black overflow-hidden">
                {service.cover_image ? (
                    <Image
                        src={service.cover_image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        loading="lazy"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/10">
                        {service.type === "beat" && <Music className="w-20 h-20" />}
                        {service.type === "art" && <ImageIcon className="w-20 h-20" />}
                        {service.type === "mixing" && <Mic2 className="w-20 h-20" />}
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <Badge variant="secondary" className="bg-black/60 backdrop-blur-md border-white/10 text-white capitalize">
                        {service.type}
                    </Badge>
                </div>
            </div>

            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <CardTitle className="text-xl text-white line-clamp-1">{service.title}</CardTitle>
                        <CardDescription className="text-mint mt-1">by {service.seller?.username || 'Unknown'}</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>
            </CardContent>

            <CardFooter className="border-t border-white/5 pt-4 flex items-center justify-between gap-2">
                <div className="font-bold text-xl text-white">
                    {service.price} <span className="text-sm font-normal text-mint">WAVE</span>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onChat(service.seller_id)}
                        className="hover:bg-white/10 hover:text-white"
                    >
                        <MessageCircle className="w-5 h-5" />
                    </Button>
                    <Button
                        onClick={() => onBuy(service)}
                        className="bg-white text-black hover:bg-mint hover:text-black transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Buy
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}
