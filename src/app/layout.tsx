import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { EmailTemplateProvider } from '@/contexts/EmailTemplateContext'
import { UserProvider } from '@/contexts/UserContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Festal Core System',
  description: 'Festal基幹システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <UserProvider>
          <EmailTemplateProvider>
            {children}
          </EmailTemplateProvider>
        </UserProvider>
      </body>
    </html>
  )
} 