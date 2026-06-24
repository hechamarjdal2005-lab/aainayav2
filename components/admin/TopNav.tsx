'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/commandes': 'Commandes',
  '/admin/produits': 'Produits',
  '/admin/packs': 'Packs',
  '/admin/certifications': 'Certifications',
  '/admin/clients': 'Clients',
  '/admin/statistiques': 'Statistiques',
  '/admin/parametres': 'Paramètres',
}

export function TopNav() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'Administration'

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-outline-variant/30 flex items-center px-6">
      <h2 className="text-xl font-serif font-bold text-on-surface">{title}</h2>
    </header>
  )
}
