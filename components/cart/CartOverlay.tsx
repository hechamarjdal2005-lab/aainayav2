'use client'

import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { CartSidebar } from './CartSidebar'
import { FloatingCartButton } from './FloatingCartButton'

export function CartOverlay() {
  const pathname = usePathname()
  const { isCartOpen, closeCart, toast } = useCart()

  const isAdmin = pathname?.startsWith('/admin')

  return (
    <>
      <CartSidebar open={isCartOpen} onClose={closeCart} />
      {!isAdmin && <FloatingCartButton />}
      {toast && (
        <div className="fixed right-5 top-24 z-[110] rounded-full bg-[#3B2420] px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </>
  )
}
