'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { formatPrix } from '@/lib/utils'
import { Minus, Plus, ShoppingBag } from 'lucide-react'

type PackCartItem = {
  id: string
  nom: string
  prix: number
  image_url: string | null
  stock?: number | null
}

export function AddPackToCartSection({ pack }: { pack: PackCartItem }) {
  const [quantite, setQuantite] = useState(1)
  const { addItem } = useCart()
  const isOutOfStock = pack.stock !== null && pack.stock !== undefined && pack.stock <= 0

  const handleAdd = () => {
    addItem({
      id: pack.id,
      item_type: 'pack',
      title: pack.nom,
      price: pack.prix,
      quantity: quantite,
      image_url: pack.image_url,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-on-surface">Quantité</span>
        <div className="flex items-center rounded-lg border border-outline-variant/40 bg-white">
          <button
            type="button"
            onClick={() => setQuantite(Math.max(1, quantite - 1))}
            className="p-2 transition-colors hover:bg-surface"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-[32px] px-4 text-center text-sm font-medium">
            {quantite}
          </span>
          <button
            type="button"
            onClick={() => setQuantite(quantite + 1)}
            className="p-2 transition-colors hover:bg-surface"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={isOutOfStock}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ShoppingBag className="h-5 w-5" />
        Ajouter au panier - {formatPrix(pack.prix * quantite)}
      </button>
    </div>
  )
}
