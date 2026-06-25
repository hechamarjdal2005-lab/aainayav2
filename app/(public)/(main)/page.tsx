import { createClient } from '@/lib/supabase/server'
import { Hero } from '@/components/storefront/Hero'
import { AboutSection } from '@/components/storefront/AboutSection'
import { HomeSections } from '@/components/storefront/HomeSections'
import { Produit, Pack, Setting } from '@/types'

async function getData() {
  const supabase = createClient()

  const [settingsRes, produitsRes, packsRes] = await Promise.all([
    supabase.from('settings').select('*').eq('id', 1).single(),
    supabase
      .from('produits')
      .select('*, categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('packs')
      .select('*, pack_produits(*, produits(*))')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  let packs = packsRes.data || []
  if (!packs.length && packsRes.error) {
    const fallback = await supabase
      .from('packs')
      .select('*, pack_items(*, products(*))')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8)
    packs = fallback.data || []
  }

  return {
    settings: (settingsRes.data || null) as Setting | null,
    produits: (produitsRes.data || []) as unknown as Produit[],
    packs: packs as unknown as Pack[],
  }
}

export default async function LandingPage() {
  const { settings, produits, packs } = await getData()

  return (
    <>
      <Hero />
      <AboutSection />
      <HomeSections produits={produits} packs={packs} settings={settings} />
    </>
  )
}
