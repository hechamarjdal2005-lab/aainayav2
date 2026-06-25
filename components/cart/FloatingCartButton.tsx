'use client'

import { useCart } from '@/context/CartContext'
import { ShoppingBag } from 'lucide-react'

export function FloatingCartButton() {
  const { totalItems, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#9F2638] text-white shadow-lg transition-colors hover:bg-[#B64A5A]"
    >
      <ShoppingBag className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#C8945B] px-1 text-xs font-bold text-white">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
