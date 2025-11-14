import type React from "react"
import { cn } from "@/lib/utils"

export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span className={cn("bg-gradient-to-r from-mint via-cyan to-violet bg-clip-text text-transparent", className)}>
      {children}
    </span>
  )
}
