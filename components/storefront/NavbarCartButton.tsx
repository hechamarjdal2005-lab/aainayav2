'use client'

import { useCart } from '@/context/CartContext'
import { ShoppingBag } from 'lucide-react'

export function NavbarCartButton() {
  const { totalItems, openCart } = useCart()

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label="Ouvrir le panier"
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#3B2420] transition-colors hover:bg-[#F3DDD8] hover:text-[#9F2638]"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C8945B] px-1 text-[10px] font-bold text-white">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  )
}
