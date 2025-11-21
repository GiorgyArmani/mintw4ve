import type React from "react"
import type { Metadata, Viewport } from "next"

import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/lib/web3-provider"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

import { Geist, Geist_Mono, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200", "300", "400", "500", "600", "700", "800", "900"] })

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "MINTWAVE - Decentralized Music Distribution",
  description: "Mint your art. Ride your wave. Upload music, earn $WAVE tokens, and access the artist marketplace.",
  keywords: ["music", "NFT", "Web3", "Ethereum", "decentralized", "artist", "marketplace"],
  authors: [{ name: "MINTWAVE" }],
  creator: "MINTWAVE",
  publisher: "MINTWAVE",
  openGraph: {
    title: "MINTWAVE - Decentralized Music Distribution",
    description: "Mint your art. Ride your wave.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MINTWAVE",
    description: "Mint your art. Ride your wave.",
  },
  icons: {
    icon: [
      {
        url: "/brand/mintwave-logo.svg",
        type: "image/svg+xml",
      },
    ],
  },
  generator: 'mintwave-devs'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Web3Provider>{children}</Web3Provider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
