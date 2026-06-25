'use client'

import { Pack } from '@/types'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { localized, useLanguage } from '@/context/LanguageContext'

interface PackCardProps {
  pack: Pack
  buttonLabel?: string
}

export function PackCard({ pack, buttonLabel }: PackCardProps) {
  const { addItem } = useCart()
  const { language, isArabic } = useLanguage()
  const originalPrice = Number(pack.prix_origine ?? pack.original_price ?? 0)
  const salePrice = Number(pack.prix_promo ?? pack.sale_price ?? 0)
  const discount =
    originalPrice > salePrice && originalPrice > 0
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0
  const title = localized(language, pack.name_fr || pack.nom || pack.name, pack.name_ar)
  const description = localized(language, pack.description_fr || pack.description, pack.description_ar)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: pack.id,
      item_type: 'pack',
      title,
      price: salePrice,
      quantity: 1,
      image_url: pack.image_url,
    })
  }

  return (
    <Link href={`/packs/${pack.id}`} className="group block">
      <div className="overflow-hidden rounded-3xl border border-[#F3DDD8] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-[260px] overflow-hidden bg-[#F3DDD8] md:h-[340px] xl:h-[380px]">
          <Image
            src={pack.image_url || '/placeholder.jpg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-[#9F2638] px-3 py-1.5 text-xs font-bold text-white shadow-md">
              -{discount}%
            </span>
          )}
        </div>

        <div className={`p-6 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <h3 className="line-clamp-1 text-xl font-bold text-[#3B2420]">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-[#3B2420]/55">
            {description}
          </p>

          <div className="mt-5 flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-bold text-[#9F2638]">
              {salePrice.toFixed(0)} MAD
            </span>
            {originalPrice > salePrice && (
              <span className="text-sm text-[#3B2420]/35 line-through">
                {originalPrice.toFixed(0)} MAD
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-5 w-full rounded-full bg-[#9F2638] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B64A5A]"
          >
            {buttonLabel || ''}
          </button>
        </div>
      </div>
    </Link>
  )
}
