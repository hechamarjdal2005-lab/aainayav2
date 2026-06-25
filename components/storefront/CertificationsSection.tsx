'use client'

import { createClient } from '@/lib/supabase/client'
import { localized, useLanguage } from '@/context/LanguageContext'
import { Certification, Setting } from '@/types'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const demoCerts: Certification[] = [
  { id: 'demo-1', nom: 'Demo', name: 'Certification', title_fr: 'Certification', title_ar: 'شهادة', description: null, ordre: 0, is_active: true, created_at: '', image_url: '/placeholder.jpg' },
  { id: 'demo-2', nom: 'Demo', name: 'Qualite', title_fr: 'Qualite', title_ar: 'جودة', description: null, ordre: 1, is_active: true, created_at: '', image_url: '/placeholder.jpg' },
  { id: 'demo-3', nom: 'Demo', name: 'Naturel', title_fr: 'Naturel', title_ar: 'طبيعي', description: null, ordre: 2, is_active: true, created_at: '', image_url: '/placeholder.jpg' },
]

export function CertificationsSection({ settings }: { settings: Partial<Setting> | null }) {
  const [certs, setCerts] = useState<Certification[]>([])
  const { language, isArabic } = useLanguage()

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('certifications')
      .select('*')
      .eq('is_active', true)
      .order('display_order')
      .then(async ({ data, error }) => {
        if (data && data.length > 0) setCerts(data as Certification[])
        if (error) {
          const fallback = await supabase
            .from('certifications')
            .select('*')
            .eq('is_active', true)
            .order('ordre')
          setCerts((fallback.data as Certification[]) || [])
        }
      })
  }, [])

  const rows = certs.length > 0 ? certs : demoCerts

  return (
    <section
      id="certifications"
      className="bg-gradient-to-r from-[#F3DDD8] to-[#FAF4EF] py-16"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-4xl px-6">
        <div className={`mb-10 ${isArabic ? 'text-right' : 'text-center'}`}>
          <h2 className="mb-2 text-3xl font-bold text-[#9F2638]">
            {localized(language, settings?.certifications_title_fr, settings?.certifications_title_ar)}
          </h2>
          <p className="text-[#3B2420]/60">
            {localized(language, settings?.certifications_text_fr, settings?.certifications_text_ar)}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8">
          {rows.slice(0, 3).map((cert) => {
            const label = localized(language, cert.title_fr || cert.name || cert.nom, cert.title_ar)
            const image = cert.image_url || cert.logo_url

            return (
              <div key={cert.id} className="flex flex-col items-center gap-3">
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-md">
                  {image && (
                    <Image
                      src={image}
                      alt={label}
                      width={96}
                      height={96}
                      className="h-full w-full object-contain"
                      unoptimized
                    />
                  )}
                </div>
                <span className="text-center text-sm font-semibold text-[#3B2420]/70">
                  {label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
