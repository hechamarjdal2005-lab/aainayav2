'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCart } from '@/context/CartContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatPrix } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, Sparkles } from 'lucide-react'
import Image from 'next/image'

const schema = z.object({
  nom_client: z.string().min(2, 'Le nom est requis'),
  telephone: z.string().min(8, 'Numéro de téléphone invalide'),
  ville: z.string().min(2, 'La ville est requise'),
  adresse: z.string().min(5, 'L\'adresse est requise'),
})

type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
  })

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) return
    setLoading(true)

    try {
      const { data: commande, error: cmdError } = await supabase
        .from('commandes')
        .insert({
          nom_client: data.nom_client,
          telephone: data.telephone,
          ville: data.ville,
          adresse: data.adresse,
          total: totalPrice,
          statut: 'en_attente',
          client_id: null,
        })
        .select()
        .single()

      if (cmdError || !commande) {
        console.error(cmdError)
        return
      }

      const itemsToInsert = items.map((item) => ({
        commande_id: commande.id,
        produit_id: item.type === 'produit' ? item.id : null,
        pack_id: item.type === 'pack' ? item.id : null,
        quantite: item.quantite,
        prix_unitaire: item.prix,
      }))

      const { error: itemsError } = await supabase
        .from('commande_items')
        .insert(itemsToInsert)

      if (itemsError) {
        console.error(itemsError)
        return
      }

      clearCart()

      router.push(`/checkout/confirmation?id=${commande.id}`)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-outline-variant" />
          <h1 className="text-2xl font-serif font-bold text-on-surface mb-2">
            Votre panier est vide
          </h1>
          <p className="text-on-surface-variant mb-6">
            Ajoutez des produits avant de passer commande
          </p>
          <Link
            href="/shop"
            className="inline-flex h-12 px-6 rounded-lg bg-primary text-white font-medium items-center justify-center hover:bg-primary-dark transition-colors"
          >
            Voir la boutique
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la boutique
      </Link>

      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-serif font-bold text-primary">
          Commande
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-3 space-y-5"
        >
          <div className="bg-surface-card border border-outline-variant/20 rounded-xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-semibold text-on-surface">
              Informations de livraison
            </h2>

            <Input
              id="nom_client"
              label="Nom complet"
              placeholder="Votre nom"
              error={errors.nom_client?.message}
              {...register('nom_client')}
            />

            <Input
              id="telephone"
              label="Téléphone"
              type="tel"
              placeholder="06 XX XX XX XX"
              error={errors.telephone?.message}
              {...register('telephone')}
            />

            <Input
              id="ville"
              label="Ville"
              placeholder="Votre ville"
              error={errors.ville?.message}
              {...register('ville')}
            />

            <div className="space-y-1">
              <label
                htmlFor="adresse"
                className="block text-sm font-medium text-on-surface"
              >
                Adresse complète
              </label>
              <textarea
                id="adresse"
                rows={3}
                placeholder="Numéro, rue, quartier, code postal..."
                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                {...register('adresse')}
              />
              {errors.adresse && (
                <p className="text-xs text-red-500">{errors.adresse.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" loading={loading} size="lg" className="w-full">
            Confirmer la commande
          </Button>
        </form>

        <div className="lg:col-span-2">
          <div className="bg-surface-card border border-outline-variant/20 rounded-xl p-6 sticky top-24">
            <h2 className="font-serif text-lg font-semibold text-on-surface mb-4">
              Récapitulatif
            </h2>

            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="flex gap-3 py-3 border-b border-outline-variant/10"
                >
                  <div className="h-14 w-14 rounded-lg bg-surface flex-shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.nom}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-outline-variant text-xl">
                        {item.type === 'pack' ? '🎁' : '🌸'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {item.nom}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      x{item.quantite}
                    </p>
                  </div>
                  <p className="text-sm font-semibold flex-shrink-0">
                    {formatPrix(item.prix * item.quantite)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 mt-2 border-t border-outline-variant/30">
              <span className="font-semibold text-on-surface">Total</span>
              <span className="text-xl font-bold text-primary">
                {formatPrix(totalPrice)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
