'use client'

import { Produit } from '@/types'
import { formatPrix } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

interface ProductCardProps {
  produit: Produit
}

export function ProductCard({ produit }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: produit.id,
      type: 'produit',
      nom: produit.nom,
      prix: produit.prix,
      quantite: 1,
      image_url: produit.image_url,
    })
  }

  return (
    <Link
      href={`/produits/${produit.id}`}
      className="group block rounded-xl bg-surface-card border border-outline-variant/20 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-square relative overflow-hidden bg-surface">
        {produit.image_url ? (
          <Image
            src={produit.image_url}
            alt={produit.nom}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-outline-variant">
            <span className="text-4xl">🌸</span>
          </div>
        )}
      </div>
      <div className="p-4">
        {produit.categories && (
          <span className="text-xs text-primary font-medium uppercase tracking-wide">
            {produit.categories.nom}
          </span>
        )}
        <h3 className="font-serif text-lg font-semibold text-on-surface mt-1">
          {produit.nom}
        </h3>
        <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">
          {produit.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            {formatPrix(produit.prix)}
          </span>
          <span
            className={`text-xs ${produit.stock > 0 ? 'text-green-600' : 'text-red-500'}`}
          >
            {produit.stock > 0 ? 'En stock' : 'Rupture'}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={produit.stock === 0}
          className="mt-3 w-full h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          Ajouter au panier
        </button>
      </div>
    </Link>
  )
}
