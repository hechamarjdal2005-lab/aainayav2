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
    <div
      className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg font-semibold">Mon Panier</h2>
            <span className="text-sm text-on-surface-variant">({totalItems})</span>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-on-surface-variant">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Votre panier est vide</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex gap-4 py-4 border-b border-outline-variant/10"
              >
                <div className="h-20 w-20 rounded-lg bg-surface flex-shrink-0 overflow-hidden">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.nom}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-outline-variant text-2xl">
                      {item.type === 'pack' ? '🎁' : '🌸'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {item.nom}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {formatPrix(item.prix)}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-outline-variant/40 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.type, Math.max(1, item.quantite - 1))
                        }
                        className="p-1.5 hover:bg-surface-card transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-medium min-w-[24px] text-center">
                        {item.quantite}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.type, item.quantite + 1)
                        }
                        className="p-1.5 hover:bg-surface-card transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.type)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold">
                    {formatPrix(item.prix * item.quantite)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-outline-variant/30 px-6 py-4 space-y-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-medium">Sous-total</span>
              <span className="text-xl font-bold text-primary">
                {formatPrix(totalPrice)}
              </span>
            </div>
            <button
              onClick={() => {
                onClose()
                router.push('/checkout')
              }}
              className="w-full h-12 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
            >
              Passer commande
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
