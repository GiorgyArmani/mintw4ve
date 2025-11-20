"use client"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface VinylRecordProps {
    coverUrl: string
    isPlaying: boolean
    size?: "sm" | "md" | "lg"
    className?: string
}

export function VinylRecord({ coverUrl, isPlaying, size = "md", className }: VinylRecordProps) {
    const sizeClasses = {
        sm: "w-32 h-32",
        md: "w-48 h-48",
        lg: "w-64 h-64",
    }

    return (
        <div className={cn("relative", sizeClasses[size], className)}>
            {/* Vinyl disc */}
            <div
                className={cn(
                    "absolute inset-0 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black",
                    "shadow-2xl transition-transform duration-300",
                    isPlaying && "animate-spin-slow",
                )}
            >
                {/* Vinyl grooves effect */}
                <div className="absolute inset-0 rounded-full opacity-30">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 rounded-full border border-white/10"
                            style={{
                                margin: `${i * 8}px`,
                            }}
                        />
                    ))}
                </div>

                {/* Center label with cover art */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={cn(
                            "relative rounded-full overflow-hidden bg-black shadow-inner",
                            size === "sm" && "w-16 h-16",
                            size === "md" && "w-24 h-24",
                            size === "lg" && "w-32 h-32",
                        )}
                    >
                        <Image src={coverUrl || "/placeholder.svg"} alt="Album cover" fill className="object-cover" />
                        {/* Center hole */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className={cn(
                                    "rounded-full bg-black border-2 border-white/20",
                                    size === "sm" && "w-3 h-3",
                                    size === "md" && "w-4 h-4",
                                    size === "lg" && "w-6 h-6",
                                )}
                            />
                        </div>
                    </div>
                </div>

                {/* Vinyl shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            </div>

            {/* Glow effect when playing */}
            {isPlaying && (
                <div className="absolute inset-0 rounded-full bg-mint/20 blur-xl animate-pulse" style={{ zIndex: -1 }} />
            )}
        </div>
    )
}
