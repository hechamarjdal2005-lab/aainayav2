import { createClient } from '@/lib/supabase/server'
import { StatistiquesContent } from './StatistiquesContent'

async function getData() {
  const supabase = createClient()

  const { data: revenus } = await supabase
    .from('commandes')
    .select('total, created_at')
    .neq('statut', 'annulee')
    .order('created_at')

  const { data: itemsRaw } = await supabase
    .from('commande_items')
    .select('produit_id, quantite, prix_unitaire')
    .not('produit_id', 'is', null)

  const produitIds = Array.from(new Set((itemsRaw || []).map(i => i.produit_id).filter(Boolean)))
  const { data: produits } = await supabase
    .from('produits')
    .select('id, nom')
    .in('id', produitIds)

  const productMap = new Map((produits || []).map(p => [p.id, p.nom]))

  const topProduits = (itemsRaw || []).map(item => ({
    produits: item.produit_id ? { nom: productMap.get(item.produit_id) || 'Inconnu' } : null,
    quantite: item.quantite,
    prix_unitaire: item.prix_unitaire,
  }))

  const { data: productsWithCat } = await supabase
    .from('produits')
    .select('categorie_id')
    .eq('is_active', true)

  const { data: categoriesData } = await supabase
    .from('categories')
    .select('id, nom')

  const catCount: Record<string, number> = {}
  if (categoriesData) {
    categoriesData.forEach((cat) => {
      const count = (productsWithCat || []).filter(
        (p) => p.categorie_id === cat.id
      ).length
      if (count > 0) catCount[cat.nom] = count
    })
  }

  const categoriesMapped = Object.entries(catCount).map(([nom]) => ({
    categories: { nom },
  }))

  const { data: cities } = await supabase
    .from('commandes')
    .select('ville, total')
    .neq('statut', 'annulee')

  return {
    revenus: (revenus || []) as { total: number; created_at: string }[],
    topProduits: topProduits as {
      produits: { nom: string } | null
      quantite: number
      prix_unitaire: number
    }[],
    categoriesData: categoriesMapped as {
      categories: { nom: string } | null
    }[],
    cities: (cities || []) as { ville: string | null; total: number }[],
  }
}

export default async function StatistiquesPage() {
  const data = await getData()
  return <StatistiquesContent data={data} />
}
