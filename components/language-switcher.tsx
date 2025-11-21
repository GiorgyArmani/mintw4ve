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

    const handleLanguageChange = (lang: Language) => {
        console.log("Changing language to:", lang)
        setLanguage(lang)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/10">
                    <Languages className="w-4 h-4" />
                    <span className="text-sm font-medium">{currentLanguage?.flag}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-white/10 min-w-[150px]">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={language === lang.code ? "bg-mint/10 text-mint font-semibold" : "hover:bg-white/5"}
                    >
                        <span className="mr-2 text-lg">{lang.flag}</span>
                        <span>{lang.label}</span>
                        {language === lang.code && <span className="ml-auto text-mint">✓</span>}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
