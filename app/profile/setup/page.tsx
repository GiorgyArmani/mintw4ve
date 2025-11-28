"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { PageShell } from "@/components/page-shell"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GradientText } from "@/components/gradient-text"
import { Loader2 } from "lucide-react"

export default function ProfileSetupPage() {
    const router = useRouter()
    const { address, isConnected } = useAccount()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Redirect if not connected
        if (!isConnected) {
            router.push('/auth/login')
            return
        }

        setIsLoading(false)
    }, [isConnected, router])

    const handleSuccess = () => {
        router.push('/dashboard')
    }

    const handleSkip = () => {
        router.push('/dashboard')
    }

    if (isLoading || !address) {
        return (
            <PageShell>
                <div className="container mx-auto px-4 py-32 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-mint" />
                </div>
            </PageShell>
        )
    }

    return (
        <PageShell>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2">
                            <GradientText>Welcome to Mintwave!</GradientText>
                        </h1>
                        <p className="text-muted-foreground">
                            Let's set up your profile. You can always edit this later.
                        </p>
                    </div>

                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle>Create Your Profile</CardTitle>
                            <CardDescription>
                                Choose a username, add a profile picture, and tell us about yourself
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm
                                walletAddress={address}
                                onSuccess={handleSuccess}
                                submitButtonText="Complete Setup"
                                showSkip={true}
                                onSkip={handleSkip}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageShell>
    )
}
