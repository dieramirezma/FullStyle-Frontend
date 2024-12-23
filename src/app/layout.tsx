import type { Metadata } from 'next'
import { Geist, Geist_Mono, Roboto, Merriweather_Sans, Raleway } from 'next/font/google'
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
  description: 'Gestión de sitios de estética y belleza'
}

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} ${merriweatherSans.variable} ${raleway.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
