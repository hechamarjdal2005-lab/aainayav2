import { createClient } from '@/lib/supabase/server'
import { CommandesContent } from './CommandesContent'

async function getCommandes() {
  const supabase = createClient()
  const { data } = await supabase
    .from('commandes')
    .select('*, commande_items(*, produits(*), packs(*))')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function CommandesPage() {
  const commandes = await getCommandes()
  return <CommandesContent commandes={commandes} />
}
