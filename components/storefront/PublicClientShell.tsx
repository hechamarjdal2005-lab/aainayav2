'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, Heart, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Setting } from '@/types'
import { localized, useLanguage } from '@/context/LanguageContext'

export function PublicClientShell({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Setting | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => setSettings((data as Setting) || null))
  }, [])

  return (
    <>
      <main>{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-outline-variant/30 bg-white py-2 md:hidden">
        <Link href="/#top" className="flex flex-col items-center gap-0.5 text-on-surface-variant">
          <Sparkles className="h-5 w-5" />
          <span className="text-[10px]">
            {localized(language, settings?.nav_home_fr, settings?.nav_home_ar)}
          </span>
        </Link>
        <Link href="/#produits" className="flex flex-col items-center gap-0.5 text-on-surface-variant">
          <ShoppingBag className="h-5 w-5" />
          <span className="text-[10px]">
            {localized(language, settings?.nav_shop_fr, settings?.nav_shop_ar)}
          </span>
        </Link>
        <Link href="/#packs" className="flex flex-col items-center gap-0.5 text-on-surface-variant">
          <Heart className="h-5 w-5" />
          <span className="text-[10px]">
            {localized(language, settings?.nav_packs_fr, settings?.nav_packs_ar)}
          </span>
        </Link>
      </nav>
    </>
  )
}
