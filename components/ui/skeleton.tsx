import * as React from "react"
import { cn } from "@/lib/utils"

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  variant?: "circle" | "rect" | "text"
}

const Skeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("animate-pulse rounded-md bg-muted", className)}
    {...props}
  />
))
Skeleton.displayName = "Skeleton"

const Shimmer = React.forwardRef<HTMLDivElement, ShimmerProps>(
  ({ className, width, height, variant = "rect", ...props }, ref) => {
    const variantClasses: Record<string, string> = {
      circle: "rounded-full",
      rect: "rounded-md",
      text: "rounded-sm h-4"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden bg-muted",
          variantClasses[variant],
          className
        )}
        style={{ width, height }}
        {...props}
      >
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>
    )
  }
)
Shimmer.displayName = "Shimmer"

export { Skeleton, Shimmer }
