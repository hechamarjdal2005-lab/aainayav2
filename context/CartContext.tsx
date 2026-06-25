'use client'

import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string; item_type: 'product' | 'pack' } }
  | {
      type: 'UPDATE_QUANTITY'
      payload: { id: string; item_type: 'product' | 'pack'; quantity: number }
    }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; payload: CartItem[] }

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (
    id: string,
    itemType: 'product' | 'pack' | 'produit'
  ) => void
  updateQuantity: (
    id: string,
    itemType: 'product' | 'pack' | 'produit',
    quantity: number
  ) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
  toast: string | null
}

const CartContext = createContext<CartContextValue | null>(null)

function normalizeType(type: 'product' | 'pack' | 'produit') {
  return type === 'produit' ? 'product' : type
}

function normalizeItem(item: CartItem): CartItem {
  const itemType = item.item_type || (item.type === 'pack' ? 'pack' : 'product')
  const quantity = Number(item.quantity ?? item.quantite ?? 1)
  const price = Number(item.price ?? item.prix ?? 0)
  const title = item.title || item.nom || 'Article'

  return {
    id: item.id,
    item_type: itemType,
    title,
    image_url: item.image_url || null,
    price,
    quantity,
    type: itemType === 'pack' ? 'pack' : 'produit',
    nom: title,
    prix: price,
    quantite: quantity,
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const item = normalizeItem(action.payload)
      const existing = state.items.find(
        (i) => i.id === item.id && i.item_type === item.item_type
      )

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id && i.item_type === item.item_type
              ? normalizeItem({ ...i, quantity: i.quantity + item.quantity })
              : i
          ),
        }
      }

      return { items: [...state.items, item] }
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(
          (i) =>
            !(i.id === action.payload.id && i.item_type === action.payload.item_type)
        ),
      }
    case 'UPDATE_QUANTITY':
      return {
        items: state.items
          .map((i) =>
            i.id === action.payload.id && i.item_type === action.payload.item_type
              ? normalizeItem({ ...i, quantity: Math.max(1, action.payload.quantity) })
              : i
          )
          .filter((i) => i.quantity > 0),
      }
    case 'CLEAR':
      return { items: [] }
    case 'HYDRATE':
      return { items: action.payload.map(normalizeItem) }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('3inaya_cart')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('3inaya_cart', JSON.stringify(state.items))
    } catch {}
  }, [state.items])

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2200)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const addItem = (item: CartItem) => {
    const normalized = normalizeItem(item)
    dispatch({ type: 'ADD_ITEM', payload: normalized })
    setToast(`${normalized.title} ajouté au panier`)
    setIsCartOpen(true)
  }

  const removeItem = (id: string, itemType: 'product' | 'pack' | 'produit') =>
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id, item_type: normalizeType(itemType) },
    })

  const updateQuantity = (
    id: string,
    itemType: 'product' | 'pack' | 'produit',
    quantity: number
  ) =>
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, item_type: normalizeType(itemType), quantity },
    })

  const clearCart = () => dispatch({ type: 'CLEAR' })
  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        openCart,
        closeCart,
        toast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
