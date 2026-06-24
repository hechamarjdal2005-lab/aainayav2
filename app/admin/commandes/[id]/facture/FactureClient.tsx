'use client'

import { Commande } from '@/types'
import { formatPrix } from '@/lib/utils'
import { Printer } from 'lucide-react'

interface FactureClientProps {
  commande: Commande
}

function formatDateShort(date: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function FactureClient({ commande }: FactureClientProps) {
  const items = commande.commande_items || []
  const invoiceId = commande.id.substring(0, 8)

  const sousTotal = items.reduce(
    (sum, item) => sum + item.prix_unitaire * item.quantite,
    0
  )

  return (
    <>
      <div className="invoice-wrapper">
        <div className="no-print text-right mb-6 max-w-[210mm] mx-auto pt-6">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            <Printer className="h-4 w-4" />
            Imprimer
          </button>
        </div>

        <div className="invoice mx-auto max-w-[210mm] bg-white p-8 md:p-12 shadow-lg print:shadow-none">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1
                className="font-serif text-4xl"
                style={{ color: '#855050', fontFamily: 'var(--font-eb-garamond), serif' }}
              >
                3INAYA
              </h1>
              <p className="text-sm mt-1" style={{ color: '#524343' }}>
                Beauté &amp; Rituels du Maroc
              </p>
            </div>
            <div className="text-right">
              <h2
                className="font-serif text-3xl"
                style={{ color: '#855050', fontFamily: 'var(--font-eb-garamond), serif' }}
              >
                FACTURE
              </h2>
              <p className="text-sm mt-1" style={{ color: '#524343' }}>
                N° #{invoiceId}
              </p>
              <p className="text-sm" style={{ color: '#524343' }}>
                Date&nbsp;: {formatDateShort(commande.created_at)}
              </p>
            </div>
          </div>

          <div
            className="mb-10 p-4 rounded-lg"
            style={{ backgroundColor: '#fff8f7', border: '1px solid #d6c2c133' }}
          >
            <h3
              className="text-sm font-semibold uppercase tracking-wider mb-2"
              style={{ color: '#524343' }}
            >
              Client
            </h3>
            <div className="space-y-1">
              <p className="font-medium" style={{ color: '#271718' }}>
                {commande.nom_client}
              </p>
              <p className="text-sm" style={{ color: '#524343' }}>
                Tél&nbsp;: {commande.telephone}
              </p>
              <p className="text-sm" style={{ color: '#524343' }}>
                {commande.adresse || ''}
                {commande.adresse && commande.ville ? ', ' : ''}
                {commande.ville || ''}
              </p>
            </div>
          </div>

          <table className="w-full mb-8" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #855050' }}>
                <th
                  className="text-left py-3 px-2 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: '#524343' }}
                >
                  Produit / Pack
                </th>
                <th
                  className="text-center py-3 px-2 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: '#524343' }}
                >
                  Qté
                </th>
                <th
                  className="text-right py-3 px-2 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: '#524343' }}
                >
                  Prix unitaire
                </th>
                <th
                  className="text-right py-3 px-2 text-sm font-semibold uppercase tracking-wider"
                  style={{ color: '#524343' }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: '1px solid #d6c2c133' }}
                >
                  <td className="py-3 px-2">
                    <p className="font-medium" style={{ color: '#271718' }}>
                      {item.produits?.nom || item.packs?.nom || 'Article'}
                    </p>
                  </td>
                  <td className="py-3 px-2 text-center" style={{ color: '#524343' }}>
                    {item.quantite}
                  </td>
                  <td className="py-3 px-2 text-right" style={{ color: '#524343' }}>
                    {formatPrix(item.prix_unitaire)}
                  </td>
                  <td className="py-3 px-2 text-right font-medium" style={{ color: '#271718' }}>
                    {formatPrix(item.prix_unitaire * item.quantite)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-10">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span style={{ color: '#524343' }}>Sous-total</span>
                <span style={{ color: '#271718' }}>{formatPrix(sousTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#524343' }}>Livraison</span>
                <span className="font-medium" style={{ color: '#16a34a' }}>
                  Gratuite
                </span>
              </div>
              <div
                className="flex justify-between pt-2"
                style={{ borderTop: '2px solid #855050' }}
              >
                <span className="font-bold text-lg" style={{ color: '#271718' }}>
                  Total
                </span>
                <span
                  className="font-bold text-lg"
                  style={{ color: '#855050' }}
                >
                  {formatPrix(commande.total)}
                </span>
              </div>
            </div>
          </div>

          <div
            className="text-center pt-6"
            style={{ borderTop: '1px solid #d6c2c133' }}
          >
            <p className="text-sm mb-1" style={{ color: '#524343' }}>
              شكراً على ثقتكم | Merci de votre confiance
            </p>
            <p className="text-xs" style={{ color: '#52434399' }}>
              3INAYA — Beauté &amp; Rituels du Maroc
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
          }
        }
      `}</style>
    </>
  )
}
