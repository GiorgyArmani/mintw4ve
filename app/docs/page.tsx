import { PageShell } from "@/components/page-shell"
import { GradientText } from "@/components/gradient-text"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DocsPage() {
  return (
    <PageShell>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Badge variant="outline">Documentation</Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Welcome to <GradientText>MINTWAVE</GradientText>
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about the decentralized music distribution platform.
            </p>
          </div>

          {/* Vision */}
          <Card>
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                MINTWAVE is building the future of music distribution - a decentralized platform where artists have
                complete control over their work, earn fair compensation for every stream, and can easily collaborate
                and trade services with other creators.
              </p>
              <p>
                By leveraging blockchain technology on Ethereum, we create a transparent, immutable record of ownership
                and earnings. No middlemen taking massive cuts, no opaque royalty calculations, just direct
                artist-to-listener connections.
              </p>
            </CardContent>
          </Card>

          {/* How $MINT Works */}
          <Card>
            <CardHeader>
              <CardTitle>How the $MINT Token Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                $MINT is an ERC-20 utility token that powers the entire MINTWAVE ecosystem. It serves as the currency
                for all transactions within the platform.
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Earning $MINT</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Receive tokens when users stream your music</li>
                    <li>Earn from providing services in the marketplace</li>
                    <li>Get rewards for platform participation</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Spending $MINT</h4>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Purchase beats and instrumentals from producers</li>
                    <li>Commission cover art and visual designs</li>
                    <li>Pay for mixing, mastering, and audio engineering</li>
                    <li>Order video editing and production services</li>
                  </ul>
                </div>
              </div>

              <p className="pt-2">
                In the future, $MINT will also be used for governance, allowing token holders to vote on platform
                decisions and feature development.
              </p>
            </CardContent>
          </Card>

          {/* MVP Status */}
          <Card className="border-mint/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>Current MVP Status</span>
                <Badge>Testnet</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                MINTWAVE is currently in MVP (Minimum Viable Product) stage. We're running on Ethereum's Sepolia
                testnet, which means:
              </p>

              <ul className="space-y-2 list-disc list-inside">
                <li>All transactions use test ETH (not real money)</li>
                <li>$MINT tokens are for testing purposes only</li>
                <li>Smart contracts are not yet deployed to mainnet</li>
                <li>Some features operate in "mock mode" for development</li>
              </ul>

              <div className="bg-muted p-4 rounded-lg mt-4">
                <p className="text-sm">
                  <strong className="text-foreground">Note:</strong> You can toggle between mock mode (no blockchain
                  required) and testnet mode in the settings. Mock mode is perfect for exploring the platform without
                  setting up a wallet.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Roadmap */}
          <Card>
            <CardHeader>
              <CardTitle>Roadmap to Mainnet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center text-white font-bold text-sm">
                      ✓
                    </div>
                    <div className="w-0.5 h-full bg-mint/30 mt-2" />
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="font-semibold mb-1">Phase 1: MVP Launch</h4>
                    <p className="text-sm text-muted-foreground">
                      Core platform features, testnet deployment, community building
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm">
                      2
                    </div>
                    <div className="w-0.5 h-full bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="font-semibold mb-1">Phase 2: Smart Contract Deployment</h4>
                    <p className="text-sm text-muted-foreground">
                      Deploy $MINT token, Track NFT contract, and Royalty Engine to mainnet
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm">
                      3
                    </div>
                    <div className="w-0.5 h-full bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-8">
                    <h4 className="font-semibold mb-1">Phase 3: Distribution & Publishing</h4>
                    <p className="text-sm text-muted-foreground">
                      Integrate with major streaming platforms, automated royalty distribution
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-sm">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">Phase 4: DAO Governance</h4>
                    <p className="text-sm text-muted-foreground">
                      Token-based governance, community-driven feature development
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle id="faq">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Is MINTWAVE free to use?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Yes! Uploading music is completely free. You only pay Ethereum gas fees when minting tracks as NFTs
                  (when we launch on mainnet). In the current MVP, everything is free.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Do I need crypto to use MINTWAVE?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  For the MVP, you can use mock mode without any crypto wallet. When we launch on mainnet, you'll need a
                  wallet like MetaMask and some ETH for gas fees.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Who owns the rights to my music?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You do! MINTWAVE never claims ownership of your content. The NFT proves your ownership on-chain, and
                  you retain all rights to your music.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">How much can I earn per stream?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The exact rate is still being determined for mainnet launch. In the MVP, you earn between 0.1-1 $MINT
                  per stream for testing purposes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">What blockchain does MINTWAVE use?</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We're built on Ethereum (currently Sepolia testnet). In the future, we may support Layer 2 solutions
                  like Base, Arbitrum, or Optimism for lower fees.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  )
}
