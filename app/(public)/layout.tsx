import { PublicClientShell } from '@/components/storefront/PublicClientShell'
import { Footer } from '@/components/storefront/Footer'
import { LanguageProvider } from '@/context/LanguageContext'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <PublicClientShell>
        {children}
        <Footer />
      </PublicClientShell>
    </LanguageProvider>
  )
}
