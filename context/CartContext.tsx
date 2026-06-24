'use client'

import { createContext, useContext, useReducer, useState, useEffect, ReactNode } from 'react'
import { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { id: string; type: 'produit' | 'pack' } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; type: 'produit' | 'pack'; quantite: number } }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; payload: CartItem[] }

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string, type: 'produit' | 'pack') => void
  updateQuantity: (id: string, type: 'produit' | 'pack', quantite: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.id === action.payload.id && i.type === action.payload.type
      )
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === existing.id && i.type === existing.type
              ? { ...i, quantite: i.quantite + action.payload.quantite }
              : i
          ),
        }
      }
      return { items: [...state.items, action.payload] }
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter(
          (i) => !(i.id === action.payload.id && i.type === action.payload.type)
        ),
      }
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id && i.type === action.payload.type
            ? { ...i, quantite: action.payload.quantite }
            : i
        ),
      }
    case 'CLEAR':
      return { items: [] }
    case 'HYDRATE':
      return { items: action.payload }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('3inaya_cart')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          dispatch({ type: 'HYDRATE', payload: parsed })
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('3inaya_cart', JSON.stringify(state.items))
    } catch {}
  }, [state.items])

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
    setIsCartOpen(true)
  }

  const removeItem = (id: string, type: 'produit' | 'pack') =>
    dispatch({ type: 'REMOVE_ITEM', payload: { id, type } })

  const updateQuantity = (id: string, type: 'produit' | 'pack', quantite: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, type, quantite } })

  const clearCart = () => dispatch({ type: 'CLEAR' })

  const openCart = () => setIsCartOpen(true)
  const closeCart = () => setIsCartOpen(false)

  const totalItems = state.items.reduce((sum, i) => sum + i.quantite, 0)
  const totalPrice = state.items.reduce(
    (sum, i) => sum + i.prix * i.quantite,
    0
  )

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
