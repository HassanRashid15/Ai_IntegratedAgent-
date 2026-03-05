import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "glow"
  size?: "sm" | "md" | "lg"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variantClasses: Record<string, string> = {
      default: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105",
      secondary: "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105",
      destructive: "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105",
      outline: "border-2 border-input bg-background/50 backdrop-blur-sm text-foreground hover:bg-accent/50 transition-all duration-300 hover:scale-105",
      glow: "bg-gradient-to-r from-primary via-purple-500 to-primary text-primary-foreground shadow-lg shadow-primary/50 animate-pulse hover:shadow-xl hover:shadow-primary/70 transition-all duration-300"
    }

    const sizeClasses: Record<string, string> = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-0.5 text-sm",
      lg: "px-3 py-1 text-base"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
