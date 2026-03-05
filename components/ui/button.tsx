import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:to-white/20 before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/80 text-destructive-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:to-white/20 before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]",
        outline:
          "border-2 border-input bg-background/50 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-105 hover:bg-accent/50 hover:border-accent active:scale-95 transition-all duration-300",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-md hover:shadow-lg hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:to-white/20 before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground hover:scale-105 active:scale-95 rounded-md transition-all duration-300",
        link: "text-primary underline-offset-4 hover:underline decoration-2 hover:decoration-primary/60 transition-all duration-300",
        glow:
          "bg-gradient-to-r from-primary via-purple-500 to-primary text-primary-foreground shadow-lg shadow-primary/50 hover:shadow-xl hover:shadow-primary/70 hover:scale-105 active:scale-95 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:to-white/30 before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%] animate-pulse",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
