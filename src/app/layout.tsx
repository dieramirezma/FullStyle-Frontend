import type { Metadata } from 'next'
import { Geist, Geist_Mono, Roboto, Merriweather_Sans, Raleway } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from './providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400']
})

const merriweatherSans = Merriweather_Sans({
  subsets: ['latin'],
  variable: '--font-merriweather-sans',
  weight: ['700']
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  weight: ['600']
})

export const metadata: Metadata = {
  title: 'FullStyle',
  description: 'Gestión de sitios de estética y belleza',
  keywords: ['estética', 'belleza', 'peluquería', 'salón de belleza']
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${merriweatherSans.variable} ${raleway.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}