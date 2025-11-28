"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Copy, ExternalLink, Check } from "lucide-react"
import { toast } from "sonner"

interface SupportButtonProps {
    walletAddress: string
    artistName: string
}

export function SupportButton({ walletAddress, artistName }: SupportButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const [amount, setAmount] = useState("")

    const copyToClipboard = () => {
        navigator.clipboard.writeText(walletAddress)
        setCopied(true)
        toast.success("Wallet address copied!")
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDirectPayment = () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        // Create MetaMask/Web3 payment link
        // This will open MetaMask with pre-filled transaction
        const paymentUrl = `https://metamask.app.link/send/${walletAddress}@1?value=${parseFloat(amount)}e18`

        // Fallback: Use ethereum: URI scheme (works with most wallets)
        const ethereumUri = `ethereum:${walletAddress}?value=${parseFloat(amount)}e18`

        // Try to open with ethereum URI first, fallback to MetaMask link
        try {
            window.location.href = ethereumUri
        } catch {
            window.open(paymentUrl, '_blank')
        }

        toast.success(`Opening wallet to send ${amount} ETH`)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-mint text-black hover:bg-mint/90 gap-2">
                    <Heart className="w-4 h-4" />
                    Support Artist
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Support {artistName}</DialogTitle>
                    <DialogDescription>
                        Send ETH directly to support this artist. In the future, you'll be able to use $W4VE tokens!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Quick Send */}
                    <div className="space-y-2">
                        <Label htmlFor="amount">Quick Send (ETH)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="amount"
                                type="number"
                                step="0.001"
                                min="0"
                                placeholder="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleDirectPayment}
                                className="bg-mint text-black hover:bg-mint/90"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Send
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Opens your wallet with pre-filled transaction
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>

                    {/* Wallet Address */}
                    <div className="space-y-2">
                        <Label htmlFor="wallet">Wallet Address</Label>
                        <div className="flex gap-2">
                            <Input
                                id="wallet"
                                value={walletAddress}
                                readOnly
                                className="flex-1 font-mono text-xs"
                            />
                            <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={copyToClipboard}
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Copy address to send from any wallet
                        </p>
                    </div>

                    {/* Coming Soon Badge */}
                    <div className="bg-mint/10 border border-mint/20 rounded-lg p-3 text-center">
                        <p className="text-sm font-medium text-mint">
                            🎵 Coming Soon: Pay with $W4VE tokens!
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
