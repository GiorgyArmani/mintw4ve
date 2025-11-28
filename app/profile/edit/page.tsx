"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { PageShell } from "@/components/page-shell"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ProfileEditPage() {
    const router = useRouter()
    const { address, isConnected } = useAccount()
    const [isLoading, setIsLoading] = useState(true)
    const [profileData, setProfileData] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        if (!isConnected || !address) {
            router.push('/auth/login')
            return
        }

        const fetchProfile = async () => {
            try {
                // Get the authenticated user first
                const { data: { user } } = await supabase.auth.getUser()

                if (!user) {
                    throw new Error('No authenticated user')
                }

                // Fetch profile by ID (more robust than wallet_address)
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (error) throw error

                setProfileData(data)
            } catch (error) {
                console.error('Failed to fetch profile:', error)
                toast.error('Failed to load profile')
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [isConnected, address, router, supabase])

    const handleSuccess = () => {
        toast.success('Profile updated!')
        router.push('/dashboard')
    }

    if (isLoading) {
        return (
            <PageShell>
                <div className="container mx-auto px-4 py-32 flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-mint" />
                </div>
            </PageShell>
        )
    }

    if (!profileData || !address) {
        return (
            <PageShell>
                <div className="container mx-auto px-4 py-32 text-center">
                    <p className="text-muted-foreground">Profile not found</p>
                </div>
            </PageShell>
        )
    }

    return (
        <PageShell>
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <Card className="glass-card border-white/10">
                        <CardHeader>
                            <CardTitle>Edit Profile</CardTitle>
                            <CardDescription>
                                Update your profile information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileForm
                                walletAddress={address}
                                initialData={profileData}
                                onSuccess={handleSuccess}
                                submitButtonText="Save Changes"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageShell>
    )
}
