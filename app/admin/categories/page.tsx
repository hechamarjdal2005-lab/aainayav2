import { createClient } from '@/lib/supabase/server'
import { CategoriesContent } from './CategoriesContent'

async function getCategories() {
  const supabase = createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('nom')
  return data || []
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  return <CategoriesContent categories={categories} />
}
