'use client'

import * as React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors h-10 w-10">
        <div className="h-[1.2rem] w-[1.2rem]" />
      </div>
    )
  }

  return (
    <div className="relative group">
      <button
        className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors h-10 w-10"
        onClick={() => {
          if (theme === 'light') {
            setTheme('dark')
          } else if (theme === 'dark') {
            setTheme('system')
          } else {
            setTheme('light')
          }
        }}
        aria-label="Switch theme"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>
      
      {/* Tooltip */}
      <div className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
        <div className="bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-1 text-xs whitespace-nowrap">
          <div className="px-2 py-1">
            {theme === 'light' && 'Light mode'}
            {theme === 'dark' && 'Dark mode'}
            {theme === 'system' && 'System theme'}
          </div>
          <div className="text-muted-foreground px-2 py-1 border-t border-border">
            Click to cycle: Light → Dark → System
          </div>
        </div>
      </div>
    </div>
  )
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
        <div className="flex items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium">
          <div className="h-4 w-4 mr-2" />
          Loading...
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
      <button
        className={`flex items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium transition-all ${
          theme === 'light' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => setTheme('light')}
      >
        <Sun className="h-4 w-4 mr-2" />
        Light
      </button>
      <button
        className={`flex items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium transition-all ${
          theme === 'dark' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => setTheme('dark')}
      >
        <Moon className="h-4 w-4 mr-2" />
        Dark
      </button>
      <button
        className={`flex items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium transition-all ${
          theme === 'system' 
            ? 'bg-background text-foreground shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => setTheme('system')}
      >
        <Monitor className="h-4 w-4 mr-2" />
        System
      </button>
    </div>
  )
}
