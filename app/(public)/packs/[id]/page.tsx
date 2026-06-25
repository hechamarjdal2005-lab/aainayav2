import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Package } from 'lucide-react'
import { AddPackToCartSection } from './AddPackToCartSection'

type ProductRow = {
  id?: string | null
  name?: string | null
  nom?: string | null
  image_url?: string | null
  price?: number | null
  prix?: number | null
}

type PackItemRow = {
  quantity?: number | null
  quantite?: number | null
  products?: ProductRow | null
  produits?: ProductRow | null
}

type PackRow = {
  id: string
  name?: string | null
  nom?: string | null
  description?: string | null
  image_url?: string | null
  original_price?: number | null
  prix_origine?: number | null
  sale_price?: number | null
  prix_promo?: number | null
  stock_quantity?: number | null
  stock?: number | null
  pack_items?: PackItemRow[] | null
  pack_produits?: PackItemRow[] | null
}

function normalizePack(row: PackRow) {
  const originalPrice = row.original_price ?? row.prix_origine ?? 0
  const salePrice = row.sale_price ?? row.prix_promo ?? 0
  const items = row.pack_items?.length ? row.pack_items : row.pack_produits || []

  return {
    id: row.id,
    name: row.name || row.nom || 'Coffret',
    description: row.description || '',
    image_url: row.image_url || null,
    originalPrice,
    salePrice,
    stock: row.stock_quantity ?? row.stock ?? null,
    items: items.map((item, index) => {
      const product = item.products || item.produits || {}

      return {
        id: product.id || `product-${index}`,
        name: product.name || product.nom || 'Produit',
        image_url: product.image_url || null,
        price: product.price ?? product.prix ?? 0,
        quantity: item.quantity ?? item.quantite ?? 1,
      }
    }),
  }
}

async function getPack(id: string) {
  const supabase = createClient()

  const { data } = await supabase
    .from('packs')
    .select(
      `
      *,
      pack_items(
        quantity,
        products(id, name, image_url, price)
      )
    `
    )
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (data) return normalizePack(data as unknown as PackRow)

  const fallback = await supabase
    .from('packs')
    .select('*, pack_produits(*, produits(*))')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (fallback.data) return normalizePack(fallback.data as unknown as PackRow)
  return null
}

export default async function PackDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const pack = await getPack(params.id)

  if (!pack) redirect('/#packs')

  const discount =
    pack.originalPrice > pack.salePrice && pack.originalPrice > 0
      ? Math.round(((pack.originalPrice - pack.salePrice) / pack.originalPrice) * 100)
      : 0

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/#packs"
        className="mb-8 inline-flex items-center gap-2 text-[#8B2635] transition-colors hover:text-[#7A2333]"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux coffrets
      </Link>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F5E8E4] shadow-lg">
          {pack.image_url ? (
            <Image
              src={pack.image_url}
              alt={pack.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-16 w-16 text-[#8B2635]/30" />
            </div>
          )}
        </div>

        <div>
          <h1
            className="mb-4 text-4xl font-bold text-[#8B2635] md:text-5xl"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {pack.name}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold text-[#8B2635]">
              {Number(pack.salePrice).toFixed(0)} MAD
            </span>
            {pack.originalPrice > pack.salePrice && (
              <span className="text-xl text-gray-400 line-through">
                {Number(pack.originalPrice).toFixed(0)} MAD
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-[#8B2635] px-3 py-1 text-sm font-bold text-white">
                -{discount}%
              </span>
            )}
          </div>

          {pack.description && (
            <p className="mb-8 leading-relaxed text-[#2C1810]/70">
              {pack.description}
            </p>
          )}

          <div className="mb-8">
            <h2
              className="mb-4 text-2xl font-bold text-[#2C1810]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Ce coffret contient:
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pack.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F5E8E4]">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <Package className="m-4 h-6 w-6 text-[#8B2635]/30" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2C1810]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#2C1810]/50">
                      Quantité: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AddPackToCartSection
            pack={{
              id: pack.id,
              nom: pack.name,
              prix: pack.salePrice,
              image_url: pack.image_url,
              stock: pack.stock,
            }}
          />
        </div>
      </div>
    </div>
  )
}
