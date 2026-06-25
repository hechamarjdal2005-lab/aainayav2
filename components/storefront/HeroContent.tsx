'use client'

import { Setting } from '@/types'
import { localized, useLanguage } from '@/context/LanguageContext'

export function HeroContent({ settings }: { settings: Partial<Setting> | null }) {
  const { language, isArabic } = useLanguage()

  return (
    <div
      className={`relative z-20 flex min-h-[85vh] items-center justify-center px-4 text-white md:min-h-screen ${
        isArabic ? 'text-right' : 'text-center'
      }`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div>
        <h1
          className="mb-4 text-6xl font-bold text-[#F3DDD8] md:text-8xl"
          style={{ fontFamily: isArabic ? 'Noto Naskh Arabic, serif' : 'Playfair Display, serif' }}
        >
          {localized(language, settings?.hero_title_fr, settings?.hero_title_ar)}
        </h1>
        <p className="mx-auto mb-3 max-w-2xl text-lg font-light italic text-white/90 md:text-2xl">
          {localized(language, settings?.hero_subtitle_fr, settings?.hero_subtitle_ar)}
        </p>
        <p className="mb-10 text-base tracking-wider text-[#C8945B]">
          {localized(language, settings?.hero_kicker_fr, settings?.hero_kicker_ar)}
        </p>
        <div className={`flex flex-wrap gap-4 ${isArabic ? 'justify-end' : 'justify-center'}`}>
          <a
            href="#produits"
            className="rounded-full bg-[#9F2638] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#B64A5A]"
          >
            {localized(language, settings?.hero_button_primary_fr, settings?.hero_button_primary_ar)}
          </a>
          <a
            href="#about"
            className="rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-[#9F2638]"
          >
            {localized(language, settings?.hero_button_secondary_fr, settings?.hero_button_secondary_ar)}
          </a>
        </div>
      </div>
    </div>
  )
}
