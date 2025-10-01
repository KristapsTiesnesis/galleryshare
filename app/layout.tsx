import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import SessionProvider from '@/components/SessionProvider'
import { Toaster } from '@/components/ui/toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gallery Share',
  description: 'Share and discover amazing galleries',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <Toaster>
            <Navigation />
            {children}
          </Toaster>
        </SessionProvider>
      </body>
    </html>
  )
}
