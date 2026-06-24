'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/admin/Sidebar'
import { TopNav } from '@/components/admin/TopNav'

export function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'
  const isFacture = pathname.includes('/facture')

  if (isLogin || isFacture) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      <div className="ml-64 flex-1">
        <TopNav />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
