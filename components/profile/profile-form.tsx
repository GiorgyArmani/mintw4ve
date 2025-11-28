

"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Loader2, User, Check, X } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface ProfileFormProps {
    walletAddress: string
    initialData?: {
        username?: string
        display_name?: string
        bio?: string
        avatar_url?: string
    }
    onSuccess?: () => void
    submitButtonText?: string
    showSkip?: boolean
    onSkip?: () => void
}

export function ProfileForm({
    walletAddress,
    initialData,
    onSuccess,
    submitButtonText = "Save Profile",
    showSkip = false,
    onSkip
}: ProfileFormProps) {
    const [username, setUsername] = useState(initialData?.username || "")
    const [displayName, setDisplayName] = useState(initialData?.display_name || "")
    const [bio, setBio] = useState(initialData?.bio || "")
    const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar_url || "")
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState(initialData?.avatar_url || "")

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Check username availability
    const checkUsername = async (value: string) => {
        if (!value || value === initialData?.username) {
            setUsernameStatus('idle')
            return
        }

        setUsernameStatus('checking')

        try {
            const res = await fetch(`/api/profile/update?username=${encodeURIComponent(value)}`)
            const data = await res.json()
            setUsernameStatus(data.available ? 'available' : 'taken')
        } catch (error) {
            console.error('Username check failed:', error)
            setUsernameStatus('idle')
        }
    }

    const handleUsernameChange = (value: string) => {
        // Only allow alphanumeric and underscores
        const sanitized = value.toLowerCase().replace(/[^a-z0-9_]/g, '')
        setUsername(sanitized)

        // Debounce username check
        const timeoutId = setTimeout(() => checkUsername(sanitized), 500)
        return () => clearTimeout(timeoutId)
    }

    const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            return
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB')
            return
        }

        setAvatarFile(file)

        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const uploadAvatar = async (): Promise<string | null> => {
        if (!avatarFile) return avatarUrl

        setIsUploadingAvatar(true)

        try {
            const formData = new FormData()
            formData.append('file', avatarFile)
            formData.append('wallet_address', walletAddress)

            const res = await fetch('/api/profile/upload-avatar', {
                method: 'POST',
                body: formData
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            return data.url
        } catch (error) {
            console.error('Avatar upload failed:', error)
            toast.error('Failed to upload avatar')
            return null
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!username) {
            toast.error('Username is required')
            return
        }

        if (usernameStatus === 'taken') {
            toast.error('Username is already taken')
            return
        }

        setIsSubmitting(true)

        try {
            // Upload avatar if new file selected
            let finalAvatarUrl = avatarUrl
            if (avatarFile) {
                const uploadedUrl = await uploadAvatar()
                if (uploadedUrl) {
                    finalAvatarUrl = uploadedUrl
                }
            }

            // Get session for auth token
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                throw new Error('No active session')
            }

            // Update profile
            const res = await fetch('/api/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    wallet_address: walletAddress,
                    username,
                    display_name: displayName || username,
                    bio,
                    avatar_url: finalAvatarUrl
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Update failed')
            }

            toast.success('Profile updated successfully!')
            onSuccess?.()
        } catch (error: any) {
            console.error('Profile update failed:', error)
            toast.error(error.message || 'Failed to update profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4">
                <Avatar className="w-32 h-32">
                    <AvatarImage src={avatarPreview} />
                    <AvatarFallback>
                        <User className="w-16 h-16" />
                    </AvatarFallback>
                </Avatar>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                >
                    {isUploadingAvatar ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photo
                        </>
                    )}
                </Button>
                <p className="text-xs text-muted-foreground">
                    JPG, PNG, or GIF. Max 5MB.
                </p>
            </div>

            {/* Username */}
            <div className="space-y-2">
                <Label htmlFor="username">
                    Username <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                    <Input
                        id="username"
                        value={username}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        placeholder="yourname"
                        className="pr-10"
                        required
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {usernameStatus === 'checking' && (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        )}
                        {usernameStatus === 'available' && (
                            <Check className="w-4 h-4 text-green-500" />
                        )}
                        {usernameStatus === 'taken' && (
                            <X className="w-4 h-4 text-red-500" />
                        )}
                    </div>
                </div>
                {usernameStatus === 'taken' && (
                    <p className="text-xs text-red-500">Username is already taken</p>
                )}
                {usernameStatus === 'available' && (
                    <p className="text-xs text-green-500">Username is available!</p>
                )}
            </div>

            {/* Display Name / Artist Name */}
            <div className="space-y-2">
                <Label htmlFor="displayName">Artist / Display Name</Label>
                <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your Name or Artist Name"
                />
                <p className="text-xs text-muted-foreground">
                    This is how you'll appear to others
                </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px]"
                    maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                    {bio.length}/500
                </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <Button
                    type="submit"
                    className="flex-1 bg-mint text-black hover:bg-mint/90"
                    disabled={isSubmitting || usernameStatus === 'taken' || !username}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        submitButtonText
                    )}
                </Button>
                {showSkip && onSkip && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onSkip}
                        disabled={isSubmitting}
                    >
                        Skip for Now
                    </Button>
                )}
            </div>
        </form>
    )
}
