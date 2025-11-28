"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface RequestFormProps {
    onSuccess: () => void
}

export function RequestForm({ onSuccess }: RequestFormProps) {
    const { address, isConnected } = useAccount()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget_min: "",
        budget_max: "",
        type: "beat",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isConnected || !address) {
            toast.error("Please connect your wallet first")
            return
        }

        setIsLoading(true)

        try {
            const res = await fetch("/api/market/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    budget_min: formData.budget_min ? parseFloat(formData.budget_min) : null,
                    budget_max: formData.budget_max ? parseFloat(formData.budget_max) : null,
                    wallet_address: address,
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Failed to create request")
            }

            toast.success("Request posted successfully!")
            setIsOpen(false)
            onSuccess()

            // Reset form
            setFormData({
                title: "",
                description: "",
                budget_min: "",
                budget_max: "",
                type: "beat",
            })
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">Post Request</Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/10 text-white max-w-lg">
                <DialogHeader>
                    <DialogTitle>Post a Service Request</DialogTitle>
                    <DialogDescription>
                        Describe what you need and set your budget.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Need a trap beat for my new single"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(val) => setFormData({ ...formData, type: val })}
                        >
                            <SelectTrigger className="bg-white/5 border-white/10">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="beat">Beat</SelectItem>
                                <SelectItem value="art">Art</SelectItem>
                                <SelectItem value="mixing">Mixing</SelectItem>
                                <SelectItem value="mastering">Mastering</SelectItem>
                                <SelectItem value="vocals">Vocals</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="budget_min">Min Budget (WAVE)</Label>
                            <Input
                                id="budget_min"
                                type="number"
                                min="0"
                                placeholder="Optional"
                                value={formData.budget_min}
                                onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budget_max">Max Budget (WAVE)</Label>
                            <Input
                                id="budget_max"
                                type="number"
                                min="0"
                                placeholder="Optional"
                                value={formData.budget_max}
                                onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Provide more details about your request..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            className="bg-white/5 border-white/10 min-h-[100px]"
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="w-full bg-mint text-black hover:bg-mint/90">
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                "Post Request"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
