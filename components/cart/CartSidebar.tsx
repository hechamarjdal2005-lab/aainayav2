'use client'

import { useCart } from '@/context/CartContext'
import { formatPrix } from '@/lib/utils'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface CartSidebarProps {
  open: boolean
  onClose: () => void
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()
  const router = useRouter()

  return (
    <div className={`fixed inset-0 z-[100] ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-[#3B2420]/35 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-[440px] max-w-full flex-col bg-[#FAF4EF] shadow-2xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#F3DDD8] bg-white px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#9F2638]" />
            <h2 className="text-xl font-bold text-[#3B2420]">Mon Panier</h2>
            <span className="text-sm text-[#3B2420]/60">({totalItems})</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#3B2420]/60 transition-colors hover:bg-[#F3DDD8] hover:text-[#9F2638]"
            aria-label="Fermer le panier"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="py-16 text-center text-[#3B2420]/55">
              <ShoppingBag className="mx-auto mb-3 h-12 w-12 opacity-30" />
              <p>Votre panier est vide</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.item_type}-${item.id}`}
                className="flex gap-4 rounded-2xl bg-white p-3 shadow-sm"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F3DDD8]">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xl text-[#9F2638]/40">
                      {item.item_type === 'pack' ? 'Pack' : 'Produit'}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#3B2420]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#9F2638]">
                    {formatPrix(item.price)}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-[#F3DDD8] bg-[#FAF4EF]">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.item_type,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="p-2 hover:text-[#9F2638]"
                        aria-label="Diminuer la quantité"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[28px] px-2 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.item_type, item.quantity + 1)
                        }
                        className="p-2 hover:text-[#9F2638]"
                        aria-label="Augmenter la quantité"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id, item.item_type)}
                      className="text-red-400 transition-colors hover:text-red-600"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="shrink-0 text-right text-sm font-bold text-[#3B2420]">
                  {formatPrix(item.price * item.quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="shrink-0 space-y-4 border-t border-[#F3DDD8] bg-white px-6 py-5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#3B2420]">Total</span>
              <span className="text-2xl font-bold text-[#9F2638]">
                {formatPrix(totalPrice)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose()
                router.push('/checkout')
              }}
              className="flex h-12 w-full items-center justify-center rounded-full bg-[#9F2638] font-semibold text-white transition-colors hover:bg-[#B64A5A]"
            >
              Commander
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
