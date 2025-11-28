"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface Request {
    id: string
    title: string
    description: string
    budget_min?: number
    budget_max?: number
    type: string
    status: string
    requester: {
        username: string
        avatar_url: string
    }
    created_at: string
}

interface RequestCardProps {
    request: Request
    onContact: (requesterId: string) => void
}

export function RequestCard({ request, onContact }: RequestCardProps) {
    return (
        <Card className="glass-card glass-hover border-white/5 overflow-hidden flex flex-col h-full">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-white/10">
                            <AvatarImage src={request.requester?.avatar_url} />
                            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg text-white line-clamp-1">{request.title}</CardTitle>
                            <CardDescription className="text-muted-foreground text-xs mt-1">
                                Posted by {request.requester?.username || 'Unknown'} • {new Date(request.created_at).toLocaleDateString()}
                            </CardDescription>
                        </div>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-white capitalize">
                        {request.type}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{request.description}</p>

                <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/60">Budget:</span>
                    <span className="font-bold text-mint">
                        {request.budget_min && request.budget_max
                            ? `${request.budget_min} - ${request.budget_max} WAVE`
                            : request.budget_min
                                ? `${request.budget_min}+ WAVE`
                                : request.budget_max
                                    ? `Up to ${request.budget_max} WAVE`
                                    : 'Negotiable'
                        }
                    </span>
                </div>
            </CardContent>

            <CardFooter className="border-t border-white/5 pt-4">
                <Button
                    onClick={() => onContact(request.requester?.username)} // Ideally ID
                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Requester
                </Button>
            </CardFooter>
        </Card>
    )
}
