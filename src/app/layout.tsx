import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toaster } from 'react-hot-toast'
import { LanguageProvider } from '../contexts/LanguageContext'
import { AuthProvider } from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ATMAN - Premium Streetwear',
  description: 'Discover the latest in urban fashion and streetwear at ATMAN',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1f2937',
                  color: '#fff',
                },
              }}
            />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}