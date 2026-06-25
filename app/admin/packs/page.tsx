import { createClient } from '@/lib/supabase/server'
import { PacksContent } from './PacksContent'

async function getPacks() {
  const supabase = createClient()
  const { data } = await supabase
    .from('packs')
    .select('*, pack_produits(*, produits(*))')
    .order('created_at', { ascending: false })
  if (data) return data

  const fallback = await supabase
    .from('packs')
    .select('*, pack_items(*, products(*))')
    .order('created_at', { ascending: false })
  return fallback.data || []
}

export default async function PacksPage() {
  const packs = await getPacks()
  return <PacksContent packs={packs} />
}
