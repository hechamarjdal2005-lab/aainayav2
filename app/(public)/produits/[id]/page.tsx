import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Produit } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Info, ArrowLeft } from 'lucide-react'
import { formatPrix } from '@/lib/utils'
import { ProductCard } from '@/components/storefront/ProductCard'
import { AddToCartSection } from './AddToCartSection'

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createClient()

  const { data: produit } = await supabase
    .from('produits')
    .select('*, categories(*)')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (!produit) redirect('/shop')

  const p = produit as unknown as Produit

  let similarProduits: Produit[] = []
  if (p.categorie_id) {
    const { data: similar } = await supabase
      .from('produits')
      .select('*, categories(*)')
      .eq('is_active', true)
      .eq('categorie_id', p.categorie_id)
      .neq('id', params.id)
      .limit(4)

    similarProduits = (similar || []) as unknown as Produit[]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link
        href="/#produits"
        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm font-medium">Retour à la boutique</span>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image */}
        <div className="aspect-square relative rounded-xl overflow-hidden bg-surface">
          {p.image_url ? (
            <Image
              src={p.image_url}
              alt={p.nom}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-outline-variant text-6xl">
              🌸
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          {p.categories && (
            <span className="inline-flex w-fit px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              {p.categories.nom}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-on-surface mt-4">
            {p.nom}
          </h1>

          <p className="text-2xl font-bold text-primary mt-3">
            {formatPrix(p.prix)}
          </p>

          <span
            className={`inline-flex w-fit px-3 py-1 rounded-full text-sm font-medium mt-3 ${
              p.stock > 0
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {p.stock > 0 ? 'En stock' : 'Rupture de stock'}
          </span>

          {p.description && (
            <p className="text-base text-on-surface-variant mt-6 leading-relaxed">
              {p.description}
            </p>
          )}

          {p.ingredients && (
            <div className="mt-6">
              <h3 className="font-serif text-lg font-semibold text-on-surface flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Ingrédients
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                {p.ingredients}
              </p>
            </div>
          )}

          {p.conseils_utilisation && (
            <div className="mt-6">
              <h3 className="font-serif text-lg font-semibold text-on-surface flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Conseils d&apos;utilisation
              </h3>
              <p className="text-sm text-on-surface-variant mt-2 leading-relaxed">
                {p.conseils_utilisation}
              </p>
            </div>
          )}

          <div className="mt-8">
            <AddToCartSection produit={p} />
          </div>
        </div>
      </div>

      {similarProduits.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-serif font-semibold text-primary mb-6">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProduits.map((sp) => (
              <ProductCard key={sp.id} produit={sp} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
