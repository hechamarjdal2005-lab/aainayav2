'use client'

import { Produit } from '@/types'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import Image from 'next/image'
import { localized, useLanguage } from '@/context/LanguageContext'

interface ProductCardProps {
  produit: Produit
  buttonLabel?: string
}

export function ProductCard({ produit, buttonLabel }: ProductCardProps) {
  const { addItem } = useCart()
  const { language, isArabic } = useLanguage()
  const title = localized(language, produit.name_fr || produit.nom, produit.name_ar)
  const description = localized(language, produit.description_fr || produit.description, produit.description_ar)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: produit.id,
      item_type: 'product',
      title,
      price: Number(produit.prix ?? produit.price ?? 0),
      quantity: 1,
      image_url: produit.image_url,
    })
  }

  return (
    <Link href={`/produits/${produit.id}`} className="group block">
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-[#F3DDD8] transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-[260px] overflow-hidden bg-[#F3DDD8] md:h-[340px] xl:h-[380px]">
          <Image
            src={produit.image_url || '/placeholder.jpg'}
            alt={produit.nom || produit.name || 'Produit'}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </div>

        <div className={`p-6 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8945B]">
            {produit.categories?.nom}
          </span>
          <h3 className="mt-2 line-clamp-1 text-xl font-bold text-[#3B2420]">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-relaxed text-[#3B2420]/55">
            {description}
          </p>
          <div className="mt-5">
            <span className="text-2xl font-bold text-[#9F2638]">
              {Number(produit.prix ?? produit.price ?? 0).toFixed(0)} MAD
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={produit.stock === 0}
            className="mt-5 w-full rounded-full bg-[#9F2638] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B64A5A] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {buttonLabel || ''}
          </button>
        </div>
      </div>
    </Link>
  )
}
