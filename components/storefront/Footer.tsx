'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Camera, Globe, Video, Music2, BookImage, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Setting } from '@/types'
import { localized, useLanguage } from '@/context/LanguageContext'

const socialIcons: {
  key: keyof Setting
  icon: React.ReactNode
  label: string
}[] = [
  { key: 'instagram_url', icon: <Camera className="h-5 w-5" />, label: 'Instagram' },
  { key: 'facebook_url', icon: <Globe className="h-5 w-5" />, label: 'Facebook' },
  { key: 'tiktok_url', icon: <Music2 className="h-5 w-5" />, label: 'TikTok' },
  { key: 'youtube_url', icon: <Video className="h-5 w-5" />, label: 'YouTube' },
  { key: 'pinterest_url', icon: <BookImage className="h-5 w-5" />, label: 'Pinterest' },
]

export function Footer() {
  const [settings, setSettings] = useState<Setting | null>(null)
  const { language, isArabic } = useLanguage()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => setSettings((data as Setting) || null))
  }, [])

  if (!settings) return null

  const socialLinks = socialIcons
    .map((s) => ({
      url: settings?.[s.key] as string | null,
      icon: s.icon,
      label: s.label,
    }))
    .filter((s) => s.url)

  return (
    <footer className="bg-[#7A2333] text-white" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#C8945B]" />
              <span className="text-xl font-bold">{settings.site_name}</span>
            </div>
            <p className="max-w-md text-sm text-white/75">
              {localized(
                language,
                settings.footer_description_fr || settings.footer_description,
                settings.footer_description_ar
              )}
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/65 transition-colors hover:text-white"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-4 font-semibold">
              {localized(language, settings.footer_links_title_fr, settings.footer_links_title_ar)}
            </h4>
            <div className="space-y-2 text-sm text-white/75">
              <Link href="/#produits" className="block hover:text-white">
                {localized(language, settings.nav_shop_fr, settings.nav_shop_ar)}
              </Link>
              <Link href="/#packs" className="block hover:text-white">
                {localized(language, settings.nav_packs_fr, settings.nav_packs_ar)}
              </Link>
              <Link href="/#about" className="block hover:text-white">
                {localized(language, settings.nav_about_fr, settings.nav_about_ar)}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">
              {localized(language, settings.footer_contact_title_fr, settings.footer_contact_title_ar)}
            </h4>
            <div className="space-y-2 text-sm text-white/75">
              {settings.contact_email && <p>{settings.contact_email}</p>}
              {settings.contact_phone && <p>{settings.contact_phone}</p>}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 py-5 text-center text-sm text-white/60">
          {settings.footer_copyright}
        </div>
      </div>
    </footer>
  )
}
