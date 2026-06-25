'use client'

import { useState } from 'react'
import { Produit } from '@/types'
import { useCart } from '@/context/CartContext'
import { ShoppingBag, Plus, Minus } from 'lucide-react'

interface AddToCartSectionProps {
  produit: Produit
}

export function AddToCartSection({ produit }: AddToCartSectionProps) {
  const [quantite, setQuantite] = useState(1)
  const { addItem } = useCart()

  const handleAdd = () => {
    addItem({
      id: produit.id,
      item_type: 'product',
      title: produit.nom || produit.name || 'Produit',
      price: Number(produit.prix ?? produit.price ?? 0),
      quantity: quantite,
      image_url: produit.image_url,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-on-surface">Quantité</span>
        <div className="flex items-center border border-outline-variant/40 rounded-lg">
          <button
            onClick={() => setQuantite(Math.max(1, quantite - 1))}
            className="p-2 hover:bg-surface-card transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 text-sm font-medium min-w-[32px] text-center">
            {quantite}
          </span>
          <button
            onClick={() => setQuantite(quantite + 1)}
            className="p-2 hover:bg-surface-card transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={produit.stock === 0}
        className="w-full h-12 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <ShoppingBag className="h-5 w-5" />
        Ajouter au panier — {new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'MAD',
        }).format(produit.prix * quantite)}
      </button>
    </div>
  )
}
