'use client'

import { Order } from '@/types'
import { formatPrix } from '@/lib/utils'
import { Printer } from 'lucide-react'

interface FactureClientProps {
  commande: Order
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

function formatDateShort(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function FactureClient({ commande }: FactureClientProps) {
  const items = commande.order_items || []
  const sousTotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0)

  return (
    <>
      <div className="invoice-wrapper bg-[#FAF4EF] min-h-screen">
        <div className="no-print mx-auto mb-6 max-w-[210mm] pt-6 text-right">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-[#9F2638] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#B64A5A]"
          >
            <Printer className="h-4 w-4" />
            Imprimer
          </button>
        </div>

        <div className="invoice mx-auto max-w-[210mm] bg-white p-8 shadow-lg print:shadow-none md:p-12">
          <div className="mb-10 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#9F2638]">3INAYA</h1>
              <p className="mt-1 text-sm text-[#3B2420]/65">
                Cosmétique & Rituels du Maroc
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-[#9F2638]">FACTURE</h2>
              <p className="mt-1 text-sm text-[#3B2420]/65">
                N° {commande.order_number}
              </p>
              <p className="text-sm text-[#3B2420]/65">
                Date: {formatDateShort(commande.created_at)}
              </p>
            </div>
          </div>

          <div className="mb-10 rounded-2xl border border-[#F3DDD8] bg-[#FAF4EF] p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#3B2420]/60">
              Client
            </h3>
            <div className="space-y-1">
              <p className="font-semibold text-[#3B2420]">{commande.client_name}</p>
              <p className="text-sm text-[#3B2420]/70">Tél: {commande.phone}</p>
              <p className="text-sm text-[#3B2420]/70">{commande.address}</p>
              <p className="text-sm text-[#3B2420]/70">
                Statut: {statusLabels[commande.status] || commande.status}
              </p>
            </div>
          </div>

          <table className="mb-8 w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #9F2638' }}>
                <th className="px-2 py-3 text-left text-sm font-semibold uppercase tracking-wider text-[#3B2420]/65">
                  Produit / Pack
                </th>
                <th className="px-2 py-3 text-center text-sm font-semibold uppercase tracking-wider text-[#3B2420]/65">
                  Quantité
                </th>
                <th className="px-2 py-3 text-right text-sm font-semibold uppercase tracking-wider text-[#3B2420]/65">
                  Prix unitaire
                </th>
                <th className="px-2 py-3 text-right text-sm font-semibold uppercase tracking-wider text-[#3B2420]/65">
                  Sous-total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F3DDD8' }}>
                  <td className="px-2 py-3">
                    <p className="font-medium text-[#3B2420]">{item.title}</p>
                    <p className="text-xs capitalize text-[#3B2420]/45">
                      {item.item_type}
                    </p>
                  </td>
                  <td className="px-2 py-3 text-center text-[#3B2420]/70">
                    {item.quantity}
                  </td>
                  <td className="px-2 py-3 text-right text-[#3B2420]/70">
                    {formatPrix(item.price)}
                  </td>
                  <td className="px-2 py-3 text-right font-medium text-[#3B2420]">
                    {formatPrix(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mb-10 flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#3B2420]/65">Sous-total</span>
                <span className="text-[#3B2420]">{formatPrix(sousTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#3B2420]/65">Livraison</span>
                <span className="font-medium text-green-600">Gratuite</span>
              </div>
              <div className="flex justify-between border-t-2 border-[#9F2638] pt-2">
                <span className="text-lg font-bold text-[#3B2420]">
                  Total général
                </span>
                <span className="text-lg font-bold text-[#9F2638]">
                  {formatPrix(commande.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#F3DDD8] pt-6 text-center">
            <p className="mb-1 text-sm text-[#3B2420]/65">
              شكراً على ثقتكم | Merci de votre confiance
            </p>
            <p className="text-xs text-[#3B2420]/40">
              3INAYA Cosmétique — Beauté & Rituels du Maroc
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
          .no-print {
            display: none !important;
          }
          .invoice {
            box-shadow: none !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
          .invoice-wrapper {
            padding: 0 !important;
            background: white !important;
          }
        }
      `}</style>
    </>
  )
}
