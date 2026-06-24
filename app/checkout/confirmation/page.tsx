'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatPrix, formatDate } from '@/lib/utils'
import { Commande } from '@/types'
import { Sparkles, Printer, Download, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import html2canvas from 'html2canvas'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const commandeId = searchParams.get('id')
  const [commande, setCommande] = useState<Commande | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!commandeId) {
      setLoading(false)
      return
    }

    const supabase = createClient()

    supabase
      .from('commandes')
      .select('*, commande_items(*, produits(*), packs(*))')
      .eq('id', commandeId)
      .single()
      .then(({ data }) => {
        setCommande(data as unknown as Commande)
        setLoading(false)
      })
  }, [commandeId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    if (!printRef.current) return
    setDownloading(true)
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      })
      const link = document.createElement('a')
      link.download = `commande-3inaya-${(commande?.id || '').slice(0, 8)}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-primary">
          <Sparkles className="h-12 w-12 mx-auto" />
        </div>
      </div>
    )
  }

  if (!commande) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-on-surface mb-2">
            Commande introuvable
          </h1>
          <Link
            href="/shop"
            className="text-primary hover:underline"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div ref={printRef} className="bg-white rounded-xl">
        <div className="text-center mb-10 pt-6">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            شكراً جزيلاً
          </h1>
          <p className="text-xl text-on-surface-variant mb-1">
            Merci pour votre commande !
          </p>
          <p className="text-sm text-on-surface-variant">
            Nous vous contacterons rapidement pour confirmer votre commande.
          </p>
        </div>

        <div className="bg-surface-card border border-outline-variant/20 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-serif text-lg font-bold">3INAYA</span>
            </div>
            <span className="text-xs text-on-surface-variant font-mono">
              #{(commande.id || '').slice(0, 8).toUpperCase()}
            </span>
          </div>

          <div className="border-t border-outline-variant/20 pt-4 grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-on-surface-variant">Client</p>
              <p className="font-medium text-on-surface">{commande.nom_client}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">Téléphone</p>
              <p className="font-medium text-on-surface">{commande.telephone}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">Ville</p>
              <p className="font-medium text-on-surface">{commande.ville}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">Adresse</p>
              <p className="font-medium text-on-surface">{commande.adresse}</p>
            </div>
            <div>
              <p className="text-on-surface-variant">Date</p>
              <p className="font-medium text-on-surface">
                {formatDate(commande.created_at)}
              </p>
            </div>
            <div>
              <p className="text-on-surface-variant">Statut</p>
              <p className="font-medium text-amber-600">En attente</p>
            </div>
          </div>

          <div className="border-t border-outline-variant/20 pt-4">
            <h3 className="font-medium text-on-surface mb-3">Articles</h3>
            <div className="space-y-2">
              {commande.commande_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm py-2 border-b border-outline-variant/10"
                >
                  <div>
                    <p className="font-medium text-on-surface">
                      {item.produits?.nom || item.packs?.nom || 'Article'}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      x{item.quantite}
                    </p>
                  </div>
                  <p className="font-semibold text-on-surface">
                    {formatPrix(item.prix_unitaire * item.quantite)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-outline-variant/30">
              <span className="font-semibold text-on-surface">Total</span>
              <span className="text-xl font-bold text-primary">
                {formatPrix(commande.total)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePrint}
          className="flex-1 h-12 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 h-12 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {downloading ? 'Téléchargement...' : 'Télécharger'}
        </button>
      </div>

      <div className="text-center mt-6">
        <Link
          href="/shop"
          className="text-sm text-primary hover:underline"
        >
          Continuer mes achats
        </Link>
      </div>

      <style jsx global>{`
        @media print {
          header, footer, nav, .fixed, button {
            display: none !important;
          }
          body { background: white !important; }
        }
      `}</style>
    </div>
  )
}
