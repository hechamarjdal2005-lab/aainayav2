import { createClient } from '@/lib/supabase/server'
import { CommandesContent } from './CommandesContent'

async function getCommandes() {
  const supabase = createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function CommandesPage() {
  const commandes = await getCommandes()
  return <CommandesContent commandes={commandes} />
}
