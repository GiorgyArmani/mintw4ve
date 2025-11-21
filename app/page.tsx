"use client"

import Link from "next/link"
import Image from "next/image"
import { PageShell } from "@/components/page-shell"
import { GradientText } from "@/components/gradient-text"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-mint/20 rounded-full blur-[120px] -z-10 opacity-50 dark:opacity-50 opacity-20" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet/20 rounded-full blur-[120px] -z-10 opacity-30 dark:opacity-30 opacity-10" />

        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="flex items-center justify-center mb-6 animate-in fade-in zoom-in duration-1000">
              <Image
                src="/mintwave-logo.svg"
                alt="MINTWAVE"
                width={500}
                height={120}
                className="drop-shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                priority
              />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-balance leading-tight">
              <span className="text-foreground">{t.home.hero.title}</span>
              <br />
              <GradientText className="animate-pulse">{t.home.hero.subtitle}</GradientText>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed">
              {t.home.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-lg bg-foreground text-background hover:bg-foreground/90 shadow-lg transition-all hover:scale-105">
                <Link href="/upload">{t.home.hero.startMinting}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 text-lg glass hover:bg-foreground/5 border-border transition-all hover:scale-105"
              >
                <Link href="/market">{t.home.hero.exploreMarket}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t.home.features.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {t.home.features.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: Mint */}
              <Card className="glass-card glass-hover border-mint/20 group">
                <CardContent className="pt-8 p-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mint to-cyan flex items-center justify-center shadow-lg shadow-mint/20 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{t.home.features.mint.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.home.features.mint.description}
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2: Stream2Earn */}
              <Card className="glass-card glass-hover border-cyan/20 group">
                <CardContent className="pt-8 p-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center shadow-lg shadow-cyan/20 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{t.home.features.stream.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.home.features.stream.description}
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3: Marketplace */}
              <Card className="glass-card glass-hover border-violet/20 group">
                <CardContent className="pt-8 p-8 space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet to-mint flex items-center justify-center shadow-lg shadow-violet/20 group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{t.home.features.market.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t.home.features.market.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Token Explanation */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mint/5 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto">
            <Card className="glass-card border-mint/30 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-12 p-12 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-mint/10 border border-mint/20 text-mint">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-mint"></span>
                    </span>
                    <span className="font-mono font-bold">{t.home.token.badge}</span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                    {t.home.token.title}
                  </h2>

                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t.home.token.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-mint" /> {t.home.token.earn}
                      </h4>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        {t.home.token.earnList.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-violet" /> {t.home.token.spend}
                      </h4>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        {t.home.token.spendList.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-mint via-cyan to-violet blur-[80px] opacity-40" />
                  <div className="relative aspect-square rounded-full bg-background/50 border border-border backdrop-blur-xl flex items-center justify-center p-12 animate-[spin_20s_linear_infinite]">
                    <div className="w-full h-full rounded-full border border-mint/30 flex items-center justify-center p-12">
                      <div className="w-full h-full rounded-full border border-cyan/30 flex items-center justify-center p-12">
                        <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-mint to-violet">
                          $W
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
              {t.home.cta.title}
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.home.cta.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-10 text-lg bg-foreground text-background hover:bg-foreground/90 shadow-xl shadow-foreground/10">
                <Link href="/auth/sign-up">{t.home.cta.button}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
