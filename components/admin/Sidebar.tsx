'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Award,
  Info,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Sparkles,
  Tags,
  Users,
  Boxes,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/packs', label: 'Packs', icon: Boxes },
  { href: '/admin/categories', label: 'Catégories', icon: Tags },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/about', label: 'À propos', icon: Info },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-100 bg-white text-gray-900">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B2635] text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-black">3INAYA</h1>
          <p className="text-xs text-gray-500">Administration</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                isActive
                  ? 'bg-[#8B2635] font-medium text-white'
                  : 'text-gray-600 hover:bg-[#8B2635]/10 hover:text-[#8B2635]'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-[#8B2635]/10 hover:text-[#8B2635]"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
