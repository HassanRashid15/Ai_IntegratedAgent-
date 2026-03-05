import type { Metadata } from 'next'
import '../styles/globals.css'
import ClientLayout from '@/components/client-layout'

export const metadata: Metadata = {
  title: {
    default: 'AI Agents — Professional Immigration & Property Analysis',
    template: '%s | AI Agents'
  },
  description: 'Professional AI-powered tools for immigration guidance and property investment analysis. Generate comprehensive reports, export PDFs, and share insights securely.',
  keywords: [
    'AI immigration assistant',
    'property investment analysis',
    'immigration guidance',
    'property deal analyzer',
    'AI-powered reports',
    'immigration checklist',
    'property investment calculator',
    'mortgage analysis',
    'rental yield calculator',
    'immigration documents',
    'property investment tools',
    'AI financial analysis'
  ],
  authors: [{ name: 'AI Agents Team' }],
  creator: 'AI Agents',
  publisher: 'AI Agents',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'AI Agents — Professional Immigration & Property Analysis',
    description: 'Professional AI-powered tools for immigration guidance and property investment analysis. Generate comprehensive reports, export PDFs, and share insights securely.',
    siteName: 'AI Agents',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Agents - Professional Immigration & Property Analysis Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Agents — Professional Immigration & Property Analysis',
    description: 'Professional AI-powered tools for immigration guidance and property investment analysis. Generate comprehensive reports, export PDFs, and share insights securely.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Agents" />
        <meta name="application-name" content="AI Agents" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
