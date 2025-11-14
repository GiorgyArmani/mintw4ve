import Link from "next/link"
import Image from "next/image"
import { PageShell } from "@/components/page-shell"
import { GradientText } from "@/components/gradient-text"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <PageShell>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center mb-1">
            <Image
              src="/mintwave-logo.svg"
              alt="MINTWAVE"
              width={500}
              height={100}
              className="transition-transform hover:scale-105"
            />
            
          </div>

          

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            <GradientText>Mint your art.</GradientText>
            <br />
            <span className="text-white">Ride your wave.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-2xl mx-auto">
            The decentralized music label where artists upload tracks, earn crypto tokens for streams, and access an
            artist marketplace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/upload">Upload & Mint</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent border-white/20 hover:bg-white/5"
            >
              <Link href="/market">Explore Marketplace</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How <GradientText>MINTWAVE</GradientText> Works
              </h2>
              <p className="text-lg text-muted-foreground">
                Three simple pillars of the decentralized creative economy
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: Mint */}
              <Card className="border-2 border-mint/20 bg-black/20 backdrop-blur-sm">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-mint to-cyan flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Upload & Mint</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Upload your tracks and mint them as NFTs on Ethereum. Each track becomes a unique digital asset that
                    proves your ownership and authenticity.
                  </p>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                      Free to upload
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                      Permanent on-chain storage
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                      Full ownership rights
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 2: Stream2Earn */}
              <Card className="border-2 border-cyan/20 bg-black/20 backdrop-blur-sm">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan to-violet flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Stream2Earn</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Earn $MINT tokens every time someone listens to your music. The more plays you get, the more tokens
                    you accumulate to spend in the marketplace.
                  </p>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                      Earn per stream
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                      Real-time payouts
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
                      Transparent earnings
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 3: Marketplace */}
              <Card className="border-2 border-violet/20 bg-black/20 backdrop-blur-sm">
                <CardContent className="pt-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet to-mint flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Artist Marketplace</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Spend your $MINT tokens on services from other artists. Get beats, cover art, mixing, video editing
                    - all within the ecosystem.
                  </p>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet" />
                      Pay with $MINT
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet" />
                      Artist-to-artist economy
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet" />
                      No middlemen
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Token Explanation */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-mint/30 bg-black/20 backdrop-blur-sm overflow-hidden">
              <div className="gradient-mint-violet p-1">
                <CardContent className="bg-black/40 backdrop-blur-sm p-8 md:p-12 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mint via-cyan to-violet flex items-center justify-center text-2xl font-bold text-white">
                      $M
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">The $MINT Token</h3>
                      <p className="text-muted-foreground">ERC-20 utility token on Ethereum</p>
                    </div>
                  </div>

                  <p className="text-lg leading-relaxed">
                    $MINT is the native token of the MINTWAVE ecosystem. Artists earn it through streams and spend it in
                    the marketplace. It's fully decentralized, transparent, and puts power back in the hands of
                    creators.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-6 pt-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Earn $MINT by:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Getting streams on your tracks</li>
                        <li>• Collaborating with artists</li>
                        <li>• Providing services in marketplace</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Spend $MINT on:</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Beats and instrumentals</li>
                        <li>• Cover art and design</li>
                        <li>• Video editing and production</li>
                        <li>• Mixing and mastering</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-balance">
              Ready to join the <GradientText>decentralized</GradientText> music revolution?
            </h2>

            <p className="text-lg text-muted-foreground">
              Connect your wallet and start minting your tracks today. No fees, no gatekeepers, just you and your art.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/upload">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-white/20 hover:bg-white/5"
              >
                <Link href="/docs">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
