"use client"

import { useState } from "react"
import { DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAccount } from "wagmi"
import { useWalletStore } from "@/store/wallet"
import { recordTip } from "@/lib/supabase/social"
import { toast } from "sonner"

interface TipButtonProps {
    artistId: string
    artistName: string
    trackId?: string
    variant?: "default" | "outline" | "ghost"
    size?: "default" | "sm" | "lg" | "icon"
}

export function TipButton({ artistId, artistName, trackId, variant = "outline", size = "sm" }: TipButtonProps) {
    const { isConnected } = useAccount()
    const { mockWaveBalance, decreaseBalance } = useWalletStore()
    const [isOpen, setIsOpen] = useState(false)
    const [amount, setAmount] = useState("")
    const [isSending, setIsSending] = useState(false)

    const handleSendTip = async () => {
        const tipAmount = Number.parseFloat(amount)

        if (!tipAmount || tipAmount <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        if (tipAmount > Number.parseFloat(mockWaveBalance)) {
            toast.error("Insufficient $WAVE balance")
            return
        }

        setIsSending(true)

        try {
            // In production, this would send a blockchain transaction
            // For now, we'll simulate it
            const tip = await recordTip(artistId, tipAmount, trackId, "0x" + Math.random().toString(16).substring(2))

            if (tip) {
                decreaseBalance(amount)
                toast.success(`Sent ${amount} $WAVE to ${artistName}!`)
                setIsOpen(false)
                setAmount("")
            } else {
                toast.error("Failed to send tip")
            }
        } catch (error) {
            console.error("Error sending tip:", error)
            toast.error("Failed to send tip")
        } finally {
            setIsSending(false)
        }
    }

    return (
        <>
            <Button variant={variant} size={size} onClick={() => setIsOpen(true)} disabled={!isConnected} className="gap-1.5">
                <DollarSign className="w-4 h-4" />
                <span>Tip</span>
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="glass">
                    <DialogHeader>
                        <DialogTitle>Support {artistName}</DialogTitle>
                        <DialogDescription>Send $WAVE tokens to show your appreciation</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount ($WAVE)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="10.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-white/5 border-white/10"
                            />
                            <p className="text-xs text-muted-foreground">Your balance: {mockWaveBalance} $WAVE</p>
                        </div>

                        {/* Quick Amount Buttons */}
                        <div className="flex gap-2">
                            {["5", "10", "25", "50"].map((preset) => (
                                <Button
                                    key={preset}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setAmount(preset)}
                                    className="flex-1 bg-white/5 border-white/10 hover:bg-mint/20 hover:border-mint/40"
                                >
                                    {preset}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSending}>
                            Cancel
                        </Button>
                        <Button onClick={handleSendTip} disabled={isSending || !amount} className="bg-mint text-black hover:bg-mint/90">
                            {isSending ? "Sending..." : `Send ${amount || "0"} $WAVE`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
