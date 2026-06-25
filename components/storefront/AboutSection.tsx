'use client'

import { createClient } from '@/lib/supabase/client'
import { localized, useLanguage } from '@/context/LanguageContext'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface AboutData {
  title_fr: string | null
  title_ar: string | null
  subtitle_fr: string | null
  subtitle_ar?: string | null
  story_fr: string | null
  story_ar: string | null
  mission_fr: string | null
  mission_ar?: string | null
  image_url: string | null
  founded_year: string | null
  products_count: string | null
  clients_count: string | null
}

export function AboutSection() {
  const [about, setAbout] = useState<AboutData | null>(null)
  const { language, isArabic } = useLanguage()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('about_us')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setAbout(data as AboutData)
      })
  }, [])

  if (!about) return null

  return (
    <section id="about" className="bg-[#FAF4EF] py-24" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 flex items-center justify-center gap-4">
          <div className="h-px w-24 bg-[#C8945B]" />
          <span className="text-3xl text-[#C8945B]">*</span>
          <div className="h-px w-24 bg-[#C8945B]" />
        </div>

        <div className="mb-20 grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-2xl">
              {about.image_url && (
                <Image
                  src={about.image_url}
                  alt={localized(language, about.title_fr, about.title_ar)}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
            </div>
          </div>

          <div className={isArabic ? 'text-right' : 'text-left'}>
            <h2 className="mb-4 text-4xl font-bold text-[#9F2638]">
              {localized(language, about.title_fr, about.title_ar)}
            </h2>
            <p className="mb-8 text-xl italic text-[#C8945B]">
              {localized(language, about.subtitle_fr, about.subtitle_ar)}
            </p>
            <p className="mb-6 text-base leading-relaxed text-[#3B2420]/75">
              {localized(language, about.story_fr, about.story_ar)}
            </p>
            <div className="mt-8 rounded-2xl border-l-4 border-[#9F2638] bg-[#9F2638]/5 p-5">
              <p className="text-sm leading-relaxed text-[#3B2420]/70">
                {localized(language, about.mission_fr, about.mission_ar)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 border-t border-[#C8945B]/20 pt-16 text-center">
          {[about.products_count, about.clients_count, about.founded_year].map((value, index) => (
            <div key={index}>
              <div className="mb-2 text-5xl font-bold text-[#9F2638]">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
