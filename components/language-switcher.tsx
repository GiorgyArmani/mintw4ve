"use client"

import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguageStore, type Language } from "@/lib/i18n"

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguageStore()

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: "en", label: "English", flag: "🇺🇸" },
        { code: "es", label: "Español", flag: "🇪🇸" },
    ]

    const currentLanguage = languages.find((l) => l.code === language)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <Languages className="w-4 h-4" />
                    <span className="hidden sm:inline">{currentLanguage?.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/10">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={language === lang.code ? "bg-mint/10 text-mint" : ""}
                    >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
