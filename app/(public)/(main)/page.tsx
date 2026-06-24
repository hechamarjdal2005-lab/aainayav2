import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/storefront/Hero'
import { ProductCard } from '@/components/storefront/ProductCard'
import { PackCard } from '@/components/storefront/PackCard'
import { Produit, Pack, Certification } from '@/types'
import { Leaf, MapPin, Heart, Truck } from 'lucide-react'

async function getData() {
  const supabase = createClient()

  const [produitsRes, packsRes, certifsRes] = await Promise.all([
    supabase
      .from('produits')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(6),
    supabase
      .from('packs')
      .select('*, pack_produits(*, produits(*))')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('certifications')
      .select('*')
      .eq('is_active', true)
      .order('ordre'),
  ])

  return {
    produits: (produitsRes.data || []) as unknown as Produit[],
    packs: (packsRes.data || []) as unknown as Pack[],
    certifs: (certifsRes.data || []) as unknown as Certification[],
  }
}

const iconMap: Record<string, React.ReactNode> = {
  leaf: <Leaf className="h-8 w-8" />,
  'map-pin': <MapPin className="h-8 w-8" />,
  heart: <Heart className="h-8 w-8" />,
  truck: <Truck className="h-8 w-8" />,
}

export default async function LandingPage() {
  const { produits, packs, certifs } = await getData()

  return (
    <>
      <Hero />

      {/* Produits */}
      {produits.length > 0 && (
        <section className="py-16 bg-surface-card">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-primary mb-2">
                Nos produits
              </h2>
              <p className="text-on-surface-variant">
                Découvrez notre sélection de soins naturels
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {produits.map((produit) => (
                <ProductCard key={produit.id} produit={produit} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Packs */}
      {packs.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-primary mb-2">
                Coffrets &amp; Rituels
              </h2>
              <p className="text-on-surface-variant">
                Des packs composés avec soin pour des rituels complets
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packs.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certifications row */}
      {certifs.length > 0 && (
        <section className="py-12 bg-surface-card">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {certifs.map((certif) => (
                <div
                  key={certif.id}
                  className="text-center p-4 rounded-xl bg-white border border-outline-variant/20"
                >
                  <div className="flex justify-center mb-3 text-primary">
                    {iconMap[certif.icone] || <Leaf className="h-8 w-8" />}
                  </div>
                  <h3 className="font-serif font-semibold text-on-surface">
                    {certif.nom}
                  </h3>
                  {certif.description && (
                    <p className="text-sm text-on-surface-variant mt-1">
                      {certif.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
