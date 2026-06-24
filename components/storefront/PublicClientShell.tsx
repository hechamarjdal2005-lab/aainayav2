'use client'

import Link from 'next/link'
import { Sparkles, Heart, ShoppingBag } from 'lucide-react'

export function PublicClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-outline-variant/30 flex justify-around py-2">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 text-on-surface-variant"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-[10px]">Accueil</span>
        </Link>
        <Link
          href="/shop"
          className="flex flex-col items-center gap-0.5 text-on-surface-variant"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[10px]">Boutique</span>
        </Link>
        <button className="flex flex-col items-center gap-0.5 text-on-surface-variant">
          <Heart className="h-5 w-5" />
          <span className="text-[10px]">Favoris</span>
        </button>
      </nav>
    </>
  )
}
