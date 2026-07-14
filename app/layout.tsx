import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-display' })

export const metadata: Metadata = {
  title: 'Leilão Legal',
  description: 'Leilão online em tempo real',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={playfair.variable}>
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
