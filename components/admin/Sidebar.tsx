'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Gift,
  Award,
  Tag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingCart },
  { href: '/admin/produits', label: 'Produits', icon: Package },
  { href: '/admin/packs', label: 'Packs', icon: Gift },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/categories', label: 'Catégories', icon: Tag },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar-bg text-white flex flex-col z-40">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-white/10">
        <Sparkles className="h-6 w-6 text-amber-400" />
        <div>
          <h1 className="text-lg font-serif font-bold">3INAYA</h1>
          <p className="text-xs text-white/60">Administration</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/10 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
