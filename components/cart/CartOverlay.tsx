'use client'

import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { CartSidebar } from './CartSidebar'
import { FloatingCartButton } from './FloatingCartButton'

export function CartOverlay() {
  const pathname = usePathname()
  const { isCartOpen, closeCart } = useCart()

  const isAdmin = pathname?.startsWith('/admin')

  return (
    <>
      <CartSidebar open={isCartOpen} onClose={closeCart} />
      {!isAdmin && <FloatingCartButton />}
    </>
  )
}
