'use client'

import { forwardRef } from 'react'
import { cn } from '../lib/utils'

interface SuggestionProps {
  suggestion: string
  onClick: (suggestion: string) => void
  className?: string
  variant?: 'default' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Suggestion = forwardRef<HTMLButtonElement, SuggestionProps>(
  ({ suggestion, onClick, className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      outline: "border border-border bg-background hover:bg-secondary/50 text-foreground"
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base"
    }

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        onClick={() => onClick(suggestion)}
        {...props}
      >
        {suggestion}
      </button>
    )
  }
)

Suggestion.displayName = 'Suggestion'

interface SuggestionsProps {
  children: React.ReactNode
  className?: string
  wrap?: boolean
}

export const Suggestions = forwardRef<HTMLDivElement, SuggestionsProps>(
  ({ children, className, wrap = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2",
          wrap ? "flex-wrap" : "flex-nowrap overflow-x-auto",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Suggestions.displayName = 'Suggestions'

// Predefined suggestion sets for different contexts
export const defaultSuggestions = [
  "Tell me about immigration assistance",
  "How does property analysis work?",
  "What are the pricing plans?",
  "How do I get started?",
]

export const immigrationSuggestions = [
  "What documents do I need for immigration?",
  "How does the immigration assistant work?",
  "Can you explain the route analysis?",
  "What warnings should I look out for?",
]

export const propertySuggestions = [
  "How do you calculate rental yield?",
  "What mortgage details do I need?",
  "Explain the investment metrics",
  "How accurate are the calculations?",
]

export const supportSuggestions = [
  "I need help with the immigration tool",
  "Property analysis isn't working",
  "How do I save my reports?",
  "Upgrade to premium features",
]

export const getContextualSuggestions = (lastUserMessage?: string, lastBotMessage?: string): string[] => {
  const lastMessage = (lastUserMessage || lastBotMessage || '').toLowerCase()
  
  if (lastMessage.includes('immigration') || lastMessage.includes('visa') || lastMessage.includes('travel')) {
    return immigrationSuggestions
  }
  
  if (lastMessage.includes('property') || lastMessage.includes('real estate') || lastMessage.includes('mortgage')) {
    return propertySuggestions
  }
  
  if (lastMessage.includes('help') || lastMessage.includes('problem') || lastMessage.includes('issue') || lastMessage.includes('support')) {
    return supportSuggestions
  }
  
  return defaultSuggestions
}
