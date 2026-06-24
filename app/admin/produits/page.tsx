import { createClient } from '@/lib/supabase/server'
import { ProduitsContent } from './ProduitsContent'

async function getProduits() {
  const supabase = createClient()
  const { data } = await supabase
    .from('produits')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })
  return data || []
}

async function getCategories() {
  const supabase = createClient()
  const { data } = await supabase.from('categories').select('*').order('nom')
  return data || []
}

export default async function ProduitsPage() {
  const [produits, categories] = await Promise.all([
    getProduits(),
    getCategories(),
  ])
  return <ProduitsContent produits={produits} categories={categories} />
}
