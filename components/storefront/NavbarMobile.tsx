'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function NavbarMobile() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center text-[#271718] transition-colors"
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-3 min-w-[160px] bg-white rounded-xl shadow-lg border border-[#d6c2c1] py-2">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 font-sans text-sm text-[#271718] hover:text-[#855050] transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/shop"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 font-sans text-sm text-[#271718] hover:text-[#855050] transition-colors"
          >
            Boutique
          </Link>
        </div>
      )}
    </div>
  )
}
