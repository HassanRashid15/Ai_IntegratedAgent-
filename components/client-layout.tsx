'use client'

import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { ThemeProvider } from '@/contexts/theme-context'
import ChatWidget from '@/components/chat-widget'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="ui-theme"
    >
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </ThemeProvider>
  )
}
