import * as React from "react"
import { cn } from "@/lib/utils"

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  magnetStrength?: number
}

const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ className, magnetStrength = 0.3, children, ...props }, ref) => {
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return
      
      const rect = buttonRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) * magnetStrength
      const deltaY = (e.clientY - centerY) * magnetStrength
      
      setPosition({ x: deltaX, y: deltaY })
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    return (
      <button
        ref={buttonRef}
        className={cn(
          "relative transition-transform duration-300 ease-out hover:scale-105 active:scale-95",
          className
        )}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </button>
    )
  }
)
MagneticButton.displayName = "MagneticButton"

interface ParallaxCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  intensity?: number
}

const ParallaxCard = React.forwardRef<HTMLDivElement, ParallaxCardProps>(
  ({ className, intensity = 0.1, children, ...props }, ref) => {
    const [transform, setTransform] = React.useState({ x: 0, y: 0 })
    const cardRef = React.useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      
      const rect = cardRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (e.clientX - centerX) * intensity
      const deltaY = (e.clientY - centerY) * intensity
      
      setTransform({ x: deltaX, y: deltaY })
    }

    const handleMouseLeave = () => {
      setTransform({ x: 0, y: 0 })
    }

    return (
      <div
        ref={cardRef}
        className={cn(
          "relative transition-transform duration-200 ease-out",
          className
        )}
        style={{
          transform: `perspective(1000px) rotateY(${-transform.x}deg) rotateX(${transform.y}deg)`
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ParallaxCard.displayName = "ParallaxCard"

interface RippleEffectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  rippleColor?: string
}

interface Ripple {
  id: number
  x: number
  y: number
}

const RippleEffectButton = React.forwardRef<HTMLButtonElement, RippleEffectProps>(
  ({ className, rippleColor = "rgba(255, 255, 255, 0.5)", children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<Ripple[]>([])
    const buttonRef = React.useRef<HTMLButtonElement>(null)

    const createRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return
      
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const newRipple: Ripple = {
        id: Date.now(),
        x,
        y
      }
      
      setRipples((prev: Ripple[]) => [...prev, newRipple])
      
      setTimeout(() => {
        setRipples((prev: Ripple[]) => prev.filter((ripple: Ripple) => ripple.id !== newRipple.id))
      }, 600)
    }

    return (
      <button
        ref={buttonRef}
        className={cn("relative overflow-hidden", className)}
        onClick={createRipple}
        {...props}
      >
        {children}
        {ripples.map((ripple: Ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full animate-ripple"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
              backgroundColor: rippleColor,
            }}
          />
        ))}
      </button>
    )
  }
)
RippleEffectButton.displayName = "RippleEffectButton"

export { MagneticButton, ParallaxCard, RippleEffectButton as RippleEffect }
