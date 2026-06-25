'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrix, formatDate } from '@/lib/utils'
import { Order } from '@/types'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderId) {
      setError('Commande introuvable.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError('Impossible de charger le reçu.')
        } else {
          setOrder(data as Order)
        }
        setLoading(false)
      })
  }, [orderId])

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#FAF4EF]">
        <div className="text-center text-[#9F2638]">
          <ShoppingBag className="mx-auto mb-3 h-10 w-10 animate-pulse" />
          Chargement du reçu...
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center bg-[#FAF4EF] px-6 text-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-[#3B2420]">
            {error || 'Commande introuvable'}
          </h1>
          <Link href="/#produits" className="text-[#9F2638] hover:underline">
            Retour à la boutique
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF4EF] px-4 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#F3DDD8] md:p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-[#9F2638]">
            Merci pour votre commande
          </h1>
          <p className="text-[#3B2420]/60">
            Voici votre reçu. Nous vous contacterons pour confirmer la livraison.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 rounded-2xl bg-[#FAF4EF] p-5 text-sm md:grid-cols-2">
          <div>
            <p className="text-[#3B2420]/50">Numéro de commande</p>
            <p className="font-bold text-[#3B2420]">{order.order_number}</p>
          </div>
          <div>
            <p className="text-[#3B2420]/50">Date</p>
            <p className="font-bold text-[#3B2420]">
              {formatDate(order.created_at)}
            </p>
          </div>
          <div>
            <p className="text-[#3B2420]/50">Nom complet</p>
            <p className="font-bold text-[#3B2420]">{order.client_name}</p>
          </div>
          <div>
            <p className="text-[#3B2420]/50">Téléphone</p>
            <p className="font-bold text-[#3B2420]">{order.phone}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-[#3B2420]/50">Adresse</p>
            <p className="font-bold text-[#3B2420]">{order.address}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#F3DDD8]">
          <div className="grid grid-cols-[1fr_80px_100px] bg-[#F3DDD8] px-4 py-3 text-sm font-bold text-[#3B2420] md:grid-cols-[1fr_100px_120px_120px]">
            <span>Produit / Pack</span>
            <span className="text-center">Qté</span>
            <span className="text-right">Prix</span>
            <span className="hidden text-right md:block">Total</span>
          </div>
          {order.order_items?.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_80px_100px] items-center border-t border-[#F3DDD8] px-4 py-3 text-sm md:grid-cols-[1fr_100px_120px_120px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#F3DDD8]">
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
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#3B2420]">
                    {item.title}
                  </p>
                  <p className="text-xs capitalize text-[#3B2420]/50">
                    {item.item_type}
                  </p>
                </div>
              </div>
              <span className="text-center text-[#3B2420]">{item.quantity}</span>
              <span className="text-right text-[#3B2420]">
                {formatPrix(item.price)}
              </span>
              <span className="hidden text-right font-semibold text-[#3B2420] md:block">
                {formatPrix(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#F3DDD8] pt-5">
          <span className="text-lg font-bold text-[#3B2420]">Total</span>
          <span className="text-3xl font-bold text-[#9F2638]">
            {formatPrix(order.total)}
          </span>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/#produits"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#9F2638] px-8 font-semibold text-white transition-colors hover:bg-[#B64A5A]"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[65vh] items-center justify-center bg-[#FAF4EF]">
          <div className="text-center text-[#9F2638]">
            <ShoppingBag className="mx-auto mb-3 h-10 w-10 animate-pulse" />
            Chargement du reçu...
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
