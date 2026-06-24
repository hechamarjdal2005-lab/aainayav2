'use client'

import { Pack } from '@/types'
import { formatPrix } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import { ShoppingBag } from 'lucide-react'

interface PackCardProps {
  pack: Pack
}

export function PackCard({ pack }: PackCardProps) {
  const { addItem } = useCart()

  const reduction = pack.prix_origine
    ? Math.round((1 - pack.prix_promo / pack.prix_origine) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: pack.id,
      type: 'pack',
      nom: pack.nom,
      prix: pack.prix_promo,
      quantite: 1,
      image_url: pack.image_url,
    })
  }

  return (
    <div className="group rounded-xl bg-surface-card border border-outline-variant/20 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-square relative overflow-hidden bg-surface">
        {pack.image_url ? (
          <Image
            src={pack.image_url}
            alt={pack.nom}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-outline-variant">
            <span className="text-4xl">🎁</span>
          </div>
        )}
        {reduction > 0 && (
          <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{reduction}%
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-on-surface">
          {pack.nom}
        </h3>
        <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">
          {pack.description}
        </p>
        {pack.pack_produits && pack.pack_produits.length > 0 && (
          <div className="mt-2 text-xs text-on-surface-variant">
            {pack.pack_produits.map((pp) => pp.produits?.nom).join(', ')}
          </div>
        )}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-primary">
            {formatPrix(pack.prix_promo)}
          </span>
          {pack.prix_origine && pack.prix_origine > pack.prix_promo && (
            <span className="text-sm text-on-surface-variant line-through">
              {formatPrix(pack.prix_origine)}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          Ajouter au panier
        </button>
      </div>
    </div>
  )
}
