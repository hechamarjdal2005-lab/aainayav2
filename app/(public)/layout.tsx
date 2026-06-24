import { PublicClientShell } from '@/components/storefront/PublicClientShell'
import { Footer } from '@/components/storefront/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <PublicClientShell>
      {children}
      <Footer />
    </PublicClientShell>
  )
}
