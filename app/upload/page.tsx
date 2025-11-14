"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { PageShell } from "@/components/page-shell"
import { GradientText } from "@/components/gradient-text"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { uploadTrackAssets } from "@/lib/storage"
import { mockMintTrack, isWeb3MockMode } from "@/lib/mock/web3Mock"
import { useTracksStore } from "@/store/tracks"
import { z } from "zod"

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  genre: z.string().min(1, "Genre is required"),
})

export default function UploadPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const addTrack = useTracksStore((state) => state.addTrack)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
  })
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    try {
      uploadSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(newErrors)
        return
      }
    }

    if (!audioFile) {
      setErrors({ ...errors, audio: "Audio file is required" })
      return
    }

    // In mock mode, we don't need a wallet
    const artistAddress = address || "0x0000000000000000000000000000000000000000"

    setIsUploading(true)
    setErrors({})

    try {
      // Step 1: Upload assets
      const uploadResult = await uploadTrackAssets({
        audioFile,
        coverFile: coverFile || undefined,
        metadata: {
          title: formData.title,
          description: formData.description,
          genre: formData.genre,
          artist: artistAddress,
        },
      })

      // Step 2: Mint track NFT
      const mintResult = await mockMintTrack(uploadResult.metadataUri, artistAddress)

      // Step 3: Store track in state
      const newTrack = {
        id: mintResult.tokenId,
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        artist: artistAddress.slice(0, 6) + "..." + artistAddress.slice(-4),
        walletAddress: artistAddress,
        coverUrl: uploadResult.coverUrl,
        audioUrl: uploadResult.audioUrl,
        metadataUri: uploadResult.metadataUri,
        tokenId: mintResult.tokenId,
        plays: 0,
        earnings: "0.00",
        createdAt: new Date().toISOString(),
      }

      addTrack(newTrack)

      // Redirect to track page
      router.push(`/tracks/${mintResult.tokenId}`)
    } catch (error) {
      console.error("Upload failed:", error)
      setErrors({ form: "Upload failed. Please try again." })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Badge variant="outline">Upload & Mint</Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Upload Your <GradientText>Music</GradientText>
            </h1>
            <p className="text-xl text-muted-foreground">
              Mint your tracks as NFTs and start earning $MINT tokens from streams.
            </p>
          </div>

          {/* Wallet Warning */}
          {!isConnected && !isWeb3MockMode() && (
            <Card className="border-mint/50">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">
                  Connect your wallet to mint tracks on-chain. Or continue in mock mode to test the platform.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle>Track Details</CardTitle>
              <CardDescription>Fill in your track information. All fields are required.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Track Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter track title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your track..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                {/* Genre */}
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre *</Label>
                  <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hip-hop">Hip Hop</SelectItem>
                      <SelectItem value="rap">Rap</SelectItem>
                      <SelectItem value="r&b">R&B</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="jazz">Jazz</SelectItem>
                      <SelectItem value="classical">Classical</SelectItem>
                      <SelectItem value="indie">Indie</SelectItem>
                      <SelectItem value="folk">Folk</SelectItem>
                      <SelectItem value="country">Country</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.genre && <p className="text-sm text-destructive">{errors.genre}</p>}
                </div>

                {/* Audio File */}
                <div className="space-y-2">
                  <Label htmlFor="audio">Audio File * (MP3, WAV)</Label>
                  <Input
                    id="audio"
                    type="file"
                    accept="audio/mp3,audio/wav,audio/mpeg"
                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  />
                  {audioFile && <p className="text-sm text-muted-foreground">Selected: {audioFile.name}</p>}
                  {errors.audio && <p className="text-sm text-destructive">{errors.audio}</p>}
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Art (Optional - JPG, PNG)</Label>
                  <Input
                    id="cover"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  />
                  {coverFile && <p className="text-sm text-muted-foreground">Selected: {coverFile.name}</p>}
                </div>

                {/* Form Error */}
                {errors.form && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive">{errors.form}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Uploading & Minting...
                    </>
                  ) : (
                    "Upload & Mint Track"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  {isWeb3MockMode()
                    ? "Running in mock mode - no blockchain transaction required"
                    : "You will be prompted to sign a transaction to mint your NFT"}
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-mint/30">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm">
                <h4 className="font-semibold">What happens when you upload?</h4>
                <ol className="space-y-2 list-decimal list-inside text-muted-foreground">
                  <li>Your audio and cover art are uploaded to decentralized storage</li>
                  <li>Track metadata is created following the ERC-721 standard</li>
                  <li>An NFT is minted on Ethereum representing your track ownership</li>
                  <li>Your track becomes available for streaming and earning $MINT</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
