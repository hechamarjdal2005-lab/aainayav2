'use client'

import Link from 'next/link'
import { Setting } from '@/types'
import { localized, useLanguage } from '@/context/LanguageContext'

export function NavbarLinks({ settings }: { settings: Partial<Setting> | null }) {
  const { language } = useLanguage()
  const links = [
    { href: '/#top', label: localized(language, settings?.nav_home_fr, settings?.nav_home_ar) },
    { href: '/#produits', label: localized(language, settings?.nav_shop_fr, settings?.nav_shop_ar) },
    { href: '/#packs', label: localized(language, settings?.nav_packs_fr, settings?.nav_packs_ar) },
    { href: '/#about', label: localized(language, settings?.nav_about_fr, settings?.nav_about_ar) },
  ]

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="font-sans text-[15px] text-[#3B2420] transition-colors duration-300 hover:text-[#9F2638]"
        >
          {link.label}
        </Link>
      ))}
    </>
  )
}
