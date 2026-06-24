import type { Metadata } from 'next'
import { EB_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import { CartOverlay } from '@/components/cart/CartOverlay'

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '3INAYA | عناية — Beauty & Rituals du Maroc',
  description:
    "Découvrez l'art du rituel de beauté marocain avec 3INAYA. Huile d'argan, ghassoul, eau de rose, savon beldi et coffrets cadeaux artisanaux.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${ebGaramond.variable} ${dmSans.variable}`}>
      <body>
        <CartProvider>
          <CartOverlay />
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
