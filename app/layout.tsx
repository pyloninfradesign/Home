import type { Metadata } from 'next'
import { Montserrat, Lora, Roboto_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { SiteChat } from '@/components/site-chat'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

export const metadata: Metadata = {
  title: 'Pylon Infra Design | Contemporary Architecture',
  description:
    'Pylon Infra Design is a contemporary architectural practice built on strength, clarity, and purpose. We create sustainable, functional, and enduring spaces.',
  keywords: [
    'architecture',
    'design',
    'infrastructure',
    'sustainable design',
    'BIM',
    'India',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${lora.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        <Navigation />
        <main>{children}</main>
        <Footer />
        <SiteChat />
        <Analytics />
      </body>
    </html>
  )
}
