'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { localized, useLanguage } from '@/context/LanguageContext'
import { Setting } from '@/types'

export function NavbarMobile({ settings }: { settings: Partial<Setting> | null }) {
  const [open, setOpen] = useState(false)
  const { language } = useLanguage()
  const navLinks = [
    { label: localized(language, settings?.nav_home_fr, settings?.nav_home_ar), href: '/#top' },
    { label: localized(language, settings?.nav_shop_fr, settings?.nav_shop_ar), href: '/#produits' },
    { label: localized(language, settings?.nav_packs_fr, settings?.nav_packs_ar), href: '/#packs' },
    { label: localized(language, settings?.nav_about_fr, settings?.nav_about_ar), href: '/#about' },
  ]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center text-[#3B2420] transition-colors"
        aria-label="Menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-3 min-w-[190px] rounded-xl border border-white/50 bg-white py-2 shadow-lg">
          <div className="px-3 pb-2">
            <LanguageSwitcher />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 font-sans text-sm text-[#3B2420] transition-colors hover:text-[#9F2638]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
