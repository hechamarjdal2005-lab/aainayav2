'use client'

import { useCart } from '@/context/CartContext'
import { ShoppingBag } from 'lucide-react'

export function FloatingCartButton() {
  const { totalItems, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-colors"
    >
      <ShoppingBag className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-secondary text-white text-xs font-bold flex items-center justify-center">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
