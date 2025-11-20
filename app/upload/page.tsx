"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { PageShell } from "@/components/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTracksStore } from "@/store/tracks"
import { Upload, Music, Image as ImageIcon, Loader2, CheckCircle2 } from "lucide-react"
import { GradientText } from "@/components/gradient-text"

export default function UploadPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const addTrack = useTracksStore((state) => state.addTrack)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadStep, setUploadStep] = useState(0) // 0: idle, 1: uploading files, 2: minting, 3: success

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
  })

  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const audioInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "audio" | "cover") => {
    if (e.target.files && e.target.files[0]) {
      if (type === "audio") setAudioFile(e.target.files[0])
      else setCoverFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !address) return
    if (!audioFile || !coverFile) return

    setIsUploading(true)
    setUploadStep(1)

    try {
      // Simulate file upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setUploadStep(2)
      // Simulate minting delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create track object
      const newTrack = {
        id: Math.random().toString(36).substring(7),
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        artist: address,
        walletAddress: address,
        coverUrl: URL.createObjectURL(coverFile), // Mock URL
        audioUrl: URL.createObjectURL(audioFile), // Mock URL
        metadataUri: "ipfs://mock-uri",
        plays: 0,
        earnings: "0",
        createdAt: new Date().toISOString(),
      }

      addTrack(newTrack)
      setUploadStep(3)

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error) {
      console.error("Upload failed:", error)
      setIsUploading(false)
      setUploadStep(0)
    }
  }

  if (!isConnected) {
    return (
      <PageShell>
        <div className="container mx-auto px-4 py-32">
          <Card className="max-w-md mx-auto text-center glass-card border-mint/20">
            <CardContent className="pt-12 pb-12 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-mint to-violet flex items-center justify-center shadow-lg shadow-mint/20 animate-pulse">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Connect to Upload</h1>
                <p className="text-muted-foreground">
                  You need to connect your wallet to upload and mint tracks.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">
              <GradientText>Upload New Track</GradientText>
            </h1>
            <p className="text-muted-foreground">
              Upload your music, mint it as an NFT, and start earning.
            </p>
          </div>

          <Card className="glass-card border-white/10">
            <CardContent className="p-8">
              {uploadStep === 3 ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-mint/20 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-mint" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Upload Successful!</h2>
                    <p className="text-muted-foreground">Your track has been minted and is now live.</p>
                  </div>
                  <p className="text-sm text-muted-foreground animate-pulse">Redirecting to dashboard...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* File Upload Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Audio Upload */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${audioFile ? "border-mint bg-mint/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                        }`}
                      onClick={() => audioInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={audioInputRef}
                        className="hidden"
                        accept="audio/*"
                        onChange={(e) => handleFileChange(e, "audio")}
                      />
                      <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <Music className={`w-6 h-6 ${audioFile ? "text-mint" : "text-muted-foreground"}`} />
                      </div>
                      {audioFile ? (
                        <div>
                          <p className="font-medium text-white truncate max-w-[200px] mx-auto">{audioFile.name}</p>
                          <p className="text-xs text-mint mt-1">Click to change</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-white">Upload Audio</p>
                          <p className="text-xs text-muted-foreground mt-1">MP3, WAV, FLAC (Max 50MB)</p>
                        </div>
                      )}
                    </div>

                    {/* Cover Art Upload */}
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${coverFile ? "border-mint bg-mint/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"
                        }`}
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={coverInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "cover")}
                      />
                      <div className="w-12 h-12 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <ImageIcon className={`w-6 h-6 ${coverFile ? "text-mint" : "text-muted-foreground"}`} />
                      </div>
                      {coverFile ? (
                        <div>
                          <p className="font-medium text-white truncate max-w-[200px] mx-auto">{coverFile.name}</p>
                          <p className="text-xs text-mint mt-1">Click to change</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-white">Upload Cover Art</p>
                          <p className="text-xs text-muted-foreground mt-1">JPG, PNG (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Track Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Track Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter track title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="bg-white/5 border-white/10 focus:border-mint/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="genre">Genre</Label>
                      <Select
                        value={formData.genre}
                        onValueChange={(value) => setFormData({ ...formData, genre: value })}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 focus:border-mint/50">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hiphop">Hip Hop</SelectItem>
                          <SelectItem value="rnb">R&B</SelectItem>
                          <SelectItem value="pop">Pop</SelectItem>
                          <SelectItem value="electronic">Electronic</SelectItem>
                          <SelectItem value="rock">Rock</SelectItem>
                          <SelectItem value="jazz">Jazz</SelectItem>
                          <SelectItem value="lofi">Lofi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Tell us about your track..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="bg-white/5 border-white/10 focus:border-mint/50 min-h-[100px]"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-mint text-black hover:bg-mint/90 h-12 text-lg font-semibold shadow-lg shadow-mint/20"
                    disabled={isUploading || !audioFile || !coverFile}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {uploadStep === 1 ? "Uploading Files..." : "Minting NFT..."}
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-5 w-5" />
                        Upload & Mint Track
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
