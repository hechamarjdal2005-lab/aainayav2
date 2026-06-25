'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { createClient } from '@/lib/supabase/client'
import { formatPrix } from '@/lib/utils'

type CheckoutForm = {
  client_name: string
  phone: string
  address: string
}

const initialForm: CheckoutForm = {
  client_name: '',
  phone: '',
  address: '',
}

function generateOrderNumber() {
  const date = new Date()
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `3IN-${ymd}-${random}`
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const setField = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setSubmitError(null)
  }

  const validate = () => {
    const next: Partial<CheckoutForm> = {}
    if (!form.client_name.trim()) next.client_name = 'Nom complet requis'
    if (!form.phone.trim()) next.phone = 'Téléphone requis'
    if (!form.address.trim()) next.address = 'Adresse requise'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || items.length === 0) return

    setLoading(true)
    setSubmitError(null)
    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: generateOrderNumber(),
          client_name: form.client_name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          total: totalPrice,
          status: 'pending',
        })
        .select()
        .single()

      if (orderError || !order) throw orderError

      const rows = items.map((item) => ({
        order_id: order.id,
        item_id: item.id,
        item_type: item.item_type,
        title: item.title,
        image_url: item.image_url,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(rows)

      if (itemsError) throw itemsError

      clearCart()
      router.push(`/checkout/confirmation?order_id=${order.id}`)
    } catch (err) {
      console.error(err)
      setSubmitError("Impossible d'enregistrer la commande. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#FAF4EF] px-6">
        <div className="text-center">
          <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-[#9F2638]/30" />
          <h1 className="mb-2 text-2xl font-bold text-[#3B2420]">
            Votre panier est vide
          </h1>
          <p className="mb-6 text-[#3B2420]/60">
            Ajoutez des produits avant de passer commande
          </p>
          <Link
            href="/#produits"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#9F2638] px-6 font-semibold text-white hover:bg-[#B64A5A]"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF4EF] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/#produits"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#3B2420]/60 hover:text-[#9F2638]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la boutique
        </Link>

        <h1 className="mb-8 text-4xl font-bold text-[#9F2638]">
          Finaliser la commande
        </h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="lg:col-span-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#F3DDD8]">
              <h2 className="mb-5 text-xl font-bold text-[#3B2420]">
                Informations client
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#3B2420]">
                    Nom complet
                  </label>
                  <input
                    value={form.client_name}
                    onChange={(e) => setField('client_name', e.target.value)}
                    className="w-full rounded-2xl border border-[#F3DDD8] px-4 py-3 outline-none focus:border-[#9F2638] focus:ring-2 focus:ring-[#9F2638]/15"
                  />
                  {errors.client_name && (
                    <p className="mt-1 text-xs text-red-600">{errors.client_name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#3B2420]">
                    Téléphone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    className="w-full rounded-2xl border border-[#F3DDD8] px-4 py-3 outline-none focus:border-[#9F2638] focus:ring-2 focus:ring-[#9F2638]/15"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#3B2420]">
                    Adresse
                  </label>
                  <textarea
                    rows={4}
                    value={form.address}
                    onChange={(e) => setField('address', e.target.value)}
                    className="w-full rounded-2xl border border-[#F3DDD8] px-4 py-3 outline-none focus:border-[#9F2638] focus:ring-2 focus:ring-[#9F2638]/15"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 h-12 w-full rounded-full bg-[#9F2638] font-semibold text-white transition-colors hover:bg-[#B64A5A] disabled:opacity-60"
              >
                {loading ? 'Confirmation...' : 'Confirmer la commande'}
              </button>
            </div>
          </form>

          <aside className="lg:col-span-2">
            <div className="sticky top-24 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#F3DDD8]">
              <h2 className="mb-5 text-xl font-bold text-[#3B2420]">
                Récapitulatif
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.item_type}-${item.id}`}
                    className="flex gap-3 border-b border-[#F3DDD8] pb-4 last:border-0"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#F3DDD8]">
                      {item.image_url && (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#3B2420]">
                        {item.title}
                      </p>
                      <p className="text-xs text-[#3B2420]/55">
                        {item.item_type === 'pack' ? 'Pack' : 'Produit'} · x{item.quantity}
                      </p>
                      <p className="mt-1 text-sm text-[#9F2638]">
                        {formatPrix(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-[#3B2420]">
                      {formatPrix(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#F3DDD8] pt-5">
                <span className="font-bold text-[#3B2420]">Total</span>
                <span className="text-2xl font-bold text-[#9F2638]">
                  {formatPrix(totalPrice)}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
