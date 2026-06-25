'use client'

import { ProductCard } from '@/components/storefront/ProductCard'
import { PackCard } from '@/components/storefront/PackCard'
import { CertificationsSection } from '@/components/storefront/CertificationsSection'
import { localized, useLanguage } from '@/context/LanguageContext'
import { Produit, Pack, Setting } from '@/types'
import { Leaf, MapPin, ShieldCheck, Truck } from 'lucide-react'

const trustBadges = [
  { frKey: 'trust_badge_1_fr', arKey: 'trust_badge_1_ar', icon: Leaf },
  { frKey: 'trust_badge_2_fr', arKey: 'trust_badge_2_ar', icon: MapPin },
  { frKey: 'trust_badge_3_fr', arKey: 'trust_badge_3_ar', icon: ShieldCheck },
  { frKey: 'trust_badge_4_fr', arKey: 'trust_badge_4_ar', icon: Truck },
] as const

export function HomeSections({
  produits,
  packs,
  settings,
}: {
  produits: Produit[]
  packs: Pack[]
  settings: Partial<Setting> | null
}) {
  const { language, isArabic } = useLanguage()
  const dir = isArabic ? 'rtl' : 'ltr'

  return (
    <>
      <section id="produits" className="bg-[#FAF4EF] py-20" dir={dir}>
        <div className="mx-auto max-w-6xl px-6">
          <div className={`mb-12 ${isArabic ? 'text-right' : 'text-center'}`}>
            <h2 className="mb-3 text-4xl font-bold text-[#9F2638]">
              {localized(language, settings?.products_title_fr, settings?.products_title_ar)}
            </h2>
            <p className="text-lg text-[#3B2420]/60">
              {localized(language, settings?.products_text_fr, settings?.products_text_ar)}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {produits.map((produit) => (
              <ProductCard
                key={produit.id}
                produit={produit}
                buttonLabel={localized(language, settings?.product_button_fr, settings?.product_button_ar)}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="packs" className="bg-white py-20" dir={dir}>
        <div className="mx-auto max-w-6xl px-6">
          <div className={`mb-12 ${isArabic ? 'text-right' : 'text-center'}`}>
            <h2 className="mb-3 text-4xl font-bold text-[#9F2638]">
              {localized(language, settings?.packs_title_fr, settings?.packs_title_ar)}
            </h2>
            <p className="text-lg text-[#3B2420]/60">
              {localized(language, settings?.packs_text_fr, settings?.packs_text_ar)}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {packs.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                buttonLabel={localized(language, settings?.pack_button_fr, settings?.pack_button_ar)}
              />
            ))}
          </div>
        </div>
      </section>

      <CertificationsSection settings={settings} />

      <section className="bg-[#FAF4EF] py-12" dir={dir}>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 md:grid-cols-4">
          {trustBadges.map((badge) => (
            <div key={badge.frKey} className="flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-sm">
              <badge.icon className="mb-3 h-8 w-8 text-[#9F2638]" />
              <span className="text-sm font-semibold text-[#3B2420]">
                {localized(language, settings?.[badge.frKey], settings?.[badge.arKey])}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
