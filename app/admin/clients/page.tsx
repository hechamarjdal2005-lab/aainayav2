import { createClient } from '@/lib/supabase/server'
import { ClientsContent } from './ClientsContent'

async function getClients() {
  const supabase = createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  return data || []
}

export default async function ClientsPage() {
  const clients = await getClients()
  return <ClientsContent clients={clients} />
}
