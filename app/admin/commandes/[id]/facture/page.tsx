import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { FactureClient } from './FactureClient'

export const metadata = {
  title: 'Facture - 3INAYA',
}

async function getCommande(id: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()
  return data
}

export default async function FacturePage({ params }: { params: { id: string } }) {
  const commande = await getCommande(params.id)

  if (!commande) notFound()

  return <FactureClient commande={commande} />
}
