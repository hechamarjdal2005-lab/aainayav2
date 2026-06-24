'use client'

import { useCart } from '@/context/CartContext'
import { ShoppingBag } from 'lucide-react'

interface CartButtonProps {
  onClick: () => void
}

export function CartButton({ onClick }: CartButtonProps) {
  const { totalItems } = useCart()

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 flex items-center justify-center h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-colors"
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
