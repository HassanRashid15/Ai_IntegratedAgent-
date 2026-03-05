import * as React from "react"
import { cn } from "@/lib/utils"

interface AnimatedGradientBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "subtle" | "vibrant" | "aurora" | "cosmic"
}

const AnimatedGradientBackground = React.forwardRef<
  HTMLDivElement,
  AnimatedGradientBackgroundProps
>(({ className, variant = "subtle", children, ...props }, ref) => {
  const variantClasses: Record<string, string> = {
    subtle: "bg-gradient-to-br from-blue-50 via-white to-purple-50",
    vibrant: "bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500",
    aurora: "bg-gradient-to-br from-green-400 via-blue-500 to-purple-600",
    cosmic: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
})
AnimatedGradientBackground.displayName = "AnimatedGradientBackground"

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg" | "xl"
  opacity?: "light" | "medium" | "heavy"
}

const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, blur = "md", opacity = "medium", ...props }, ref) => {
    const blurClasses: Record<string, string> = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl"
    }

    const opacityClasses: Record<string, string> = {
      light: "bg-white/20",
      medium: "bg-white/30",
      heavy: "bg-white/40"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border border-white/20 shadow-xl",
          blurClasses[blur],
          opacityClasses[opacity],
          "transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]",
          className
        )}
        {...props}
      />
    )
  }
)
GlassPanel.displayName = "GlassPanel"

interface FloatingOrbProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"
  color?: "blue" | "purple" | "pink" | "green" | "yellow"
  animationDuration?: number
}

const FloatingOrb = React.forwardRef<HTMLDivElement, FloatingOrbProps>(
  ({ className, size = "md", color = "blue", animationDuration = 3000, ...props }, ref) => {
    const sizeClasses: Record<string, string> = {
      sm: "w-16 h-16",
      md: "w-24 h-24",
      lg: "w-32 h-32",
      xl: "w-48 h-48"
    }

    const colorClasses: Record<string, string> = {
      blue: "bg-gradient-to-br from-blue-400 to-blue-600",
      purple: "bg-gradient-to-br from-purple-400 to-purple-600",
      pink: "bg-gradient-to-br from-pink-400 to-pink-600",
      green: "bg-gradient-to-br from-green-400 to-green-600",
      yellow: "bg-gradient-to-br from-yellow-400 to-yellow-600"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-full blur-2xl opacity-60 animate-float",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        style={{
          animationDuration: `${animationDuration}ms`
        }}
        {...props}
      />
    )
  }
)
FloatingOrb.displayName = "FloatingOrb"

export { AnimatedGradientBackground, GlassPanel, FloatingOrb }
