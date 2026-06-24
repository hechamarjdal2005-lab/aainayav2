import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/storefront/ProductCard'
import { PackCard } from '@/components/storefront/PackCard'
import { Produit, Pack, Category } from '@/types'

async function getData(searchParams: { category?: string }) {
  const supabase = createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('nom')

  let produitsQuery = supabase
    .from('produits')
    .select('*, categories(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (searchParams.category) {
    const cat = categories?.find(
      (c) => c.slug === searchParams.category
    )
    if (cat) {
      produitsQuery = produitsQuery.eq('categorie_id', cat.id)
    }
  }

  const { data: produits } = await produitsQuery

  const { data: packs } = await supabase
    .from('packs')
    .select('*, pack_produits(*, produits(*))')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return {
    categories: (categories || []) as Category[],
    produits: (produits || []) as unknown as Produit[],
    packs: (packs || []) as unknown as Pack[],
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const { categories, produits, packs } = await getData(searchParams)
  const activeCategory = searchParams.category || 'all'

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif font-bold text-primary mb-2">
          Boutique
        </h1>
        <p className="text-on-surface-variant">
          Rituels de beauté naturels du Maroc
        </p>
      </div>

      {/* Category filter */}
      <div className="flex justify-center gap-3 mb-10 flex-wrap">
        <a
          href="/shop"
          className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-surface-card text-on-surface-variant hover:bg-outline-variant/30'
          }`}
        >
          Tout
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.slug
                ? 'bg-primary text-white'
                : 'bg-surface-card text-on-surface-variant hover:bg-outline-variant/30'
            }`}
          >
            {cat.nom}
          </a>
        ))}
      </div>

      {/* Packs section */}
      {packs.length > 0 && !searchParams.category && (
        <section className="mb-16">
          <h2 className="text-2xl font-serif font-semibold text-primary mb-6">
            Coffrets &amp; Rituels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packs.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </section>
      )}

      {/* Produits grid */}
      <section>
        <h2 className="text-2xl font-serif font-semibold text-primary mb-6">
          {searchParams.category
            ? categories.find((c) => c.slug === searchParams.category)?.nom || 'Produits'
            : 'Tous nos produits'}
        </h2>
        {produits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produits.map((produit) => (
              <ProductCard key={produit.id} produit={produit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-on-surface-variant">
            Aucun produit trouvé dans cette catégorie
          </div>
        )}
      </section>
    </div>
  )
}
