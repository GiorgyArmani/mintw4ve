"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from 'next/navigation'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ModeToggle } from "@/components/mode-toggle"
import { createClient } from "@/lib/supabase/client"
import { useTranslation } from "@/lib/i18n"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js"
import { useAccount } from "wagmi"

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const { t } = useTranslation()

  const { address, isConnected } = useAccount()

  // Sync wallet with database profile
  useEffect(() => {
    if (isConnected && address) {
      fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      })
        .then(res => res.json())
        .then(data => {
          console.log('Profile sync:', data)
        })
        .catch(err => console.error('Profile sync failed:', err))
    }
  }, [isConnected, address])

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Image src="/mintwave-logo.svg" alt="MINTWAVE" width={32} height={32} />
              <span className="hidden font-bold sm:inline-block">MINTWAVE</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/" ? "text-foreground" : "text-foreground/60"
                )}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/listen"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/listen" ? "text-foreground" : "text-foreground/60"
                )}
              >
                {t.nav.listen}
              </Link>
              <Link
                href="/docs"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/docs" ? "text-foreground" : "text-foreground/60"
                )}
              >
                {t.nav.docs}
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className={cn(
                      "transition-colors hover:text-foreground/80",
                      pathname === "/dashboard" ? "text-foreground" : "text-foreground/60"
                    )}
                  >
                    {t.nav.dashboard}
                  </Link>
                  <Link
                    href="/market"
                    className={cn(
                      "transition-colors hover:text-foreground/80",
                      pathname === "/market" ? "text-foreground" : "text-foreground/60"
                    )}
                  >
                    {t.nav.marketplace}
                  </Link>
                  <Link
                    href="/upload"
                    className={cn(
                      "transition-colors hover:text-foreground/80",
                      pathname === "/upload" ? "text-foreground" : "text-foreground/60"
                    )}
                  >
                    {t.nav.upload}
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Search or empty spacer */}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline-block text-xs text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {user.email}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-white hover:bg-white/10"
                  >
                    {t.auth.signout}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <ModeToggle />
                  <LanguageSwitcher />
                  <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-white hidden md:flex">
                    <Link href="/auth/login">{t.auth.login}</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-mint text-black hover:bg-mint/90 font-semibold shadow-lg shadow-mint/20 hidden md:flex">
                    <Link href="/auth/sign-up">{t.auth.signup}</Link>
                  </Button>
                </div>
              )}

              <div className="h-6 w-px bg-white/10 mx-1 hidden md:block" />
              <div className="hidden md:block">
                <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="icon" />
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden flex items-center gap-2">
                <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="icon" />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] glass border-l border-white/10">
                    <SheetTitle className="text-lg font-bold mb-4">Menu</SheetTitle>
                    <nav className="flex flex-col gap-4">
                      <Link
                        href="/"
                        className={cn(
                          "text-lg font-medium transition-colors hover:text-mint",
                          pathname === "/" ? "text-white" : "text-muted-foreground",
                        )}
                      >
                        {t.nav.home}
                      </Link>
                      <Link
                        href="/listen"
                        className={cn(
                          "text-lg font-medium transition-colors hover:text-mint",
                          pathname === "/listen" ? "text-white" : "text-muted-foreground",
                        )}
                      >
                        {t.nav.listen}
                      </Link>
                      <Link
                        href="/docs"
                        className={cn(
                          "text-lg font-medium transition-colors hover:text-mint",
                          pathname === "/docs" ? "text-white" : "text-muted-foreground",
                        )}
                      >
                        {t.nav.docs}
                      </Link>
                      {user ? (
                        <>
                          <Link
                            href="/dashboard"
                            className={cn(
                              "text-lg font-medium transition-colors hover:text-mint",
                              pathname === "/dashboard" ? "text-white" : "text-muted-foreground",
                            )}
                          >
                            {t.nav.dashboard}
                          </Link>
                          <Link
                            href="/market"
                            className={cn(
                              "text-lg font-medium transition-colors hover:text-mint",
                              pathname === "/market" ? "text-white" : "text-muted-foreground",
                            )}
                          >
                            {t.nav.marketplace}
                          </Link>
                          <Link
                            href="/upload"
                            className={cn(
                              "text-lg font-medium transition-colors hover:text-mint",
                              pathname === "/upload" ? "text-white" : "text-muted-foreground",
                            )}
                          >
                            {t.nav.upload}
                          </Link>
                          <Button
                            onClick={handleSignOut}
                            variant="ghost"
                            className="justify-start px-0 text-lg font-medium text-muted-foreground hover:text-white hover:bg-transparent"
                          >
                            {t.auth.signout}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/auth/login"
                            className="text-lg font-medium text-muted-foreground hover:text-white transition-colors"
                          >
                            {t.auth.login}
                          </Link>
                          <Link
                            href="/auth/sign-up"
                            className="text-lg font-medium text-mint hover:text-mint/80 transition-colors"
                          >
                            {t.auth.signup}
                          </Link>
                        </>
                      )}
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Image src="/mintwave-logo.svg" alt="MINTWAVE" width={120} height={40} />
              </div>
              <p className="text-sm text-muted-foreground">{t.footer.tagline}</p>
              <p className="text-xs text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-semibold mb-4">{t.footer.platform}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/upload" className="hover:text-foreground transition-colors">
                    {t.nav.upload}
                  </Link>
                </li>
                <li>
                  <Link href="/market" className="hover:text-foreground transition-colors">
                    {t.nav.marketplace}
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    {t.nav.dashboard}
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    {t.footer.howItWorks}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold mb-4">{t.footer.resources}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    {t.footer.documentation}
                  </Link>
                </li>
                <li>
                  <Link href="/docs#faq" className="hover:text-foreground transition-colors">
                    {t.footer.faq}
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/mintwave" className="hover:text-foreground transition-colors">
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link href="https://discord.gg/mintwave" className="hover:text-foreground transition-colors">
                    Discord
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold mb-4">{t.footer.legal}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link href="/licenses" className="hover:text-foreground transition-colors">
                    {t.footer.licenses}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2025 MINTWAVE. {t.footer.rights}</p>
            <div className="flex items-center gap-4">
              <a
                href="https://twitter.com/mintwave"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/mintwave"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://discord.gg/mintwave"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="sr-only">Discord</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.36.698.772 1.362 1.226 1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
