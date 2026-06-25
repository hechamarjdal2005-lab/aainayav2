import { createClient } from '@/lib/supabase/server'
import { CertificationsContent } from './CertificationsContent'

async function getCertifications() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('certifications')
    .select('*')
    .order('display_order')
  if (data && !error) return data

  const fallback = await supabase
    .from('certifications')
    .select('*')
    .order('ordre')
  return fallback.data || []
}

export default async function CertificationsPage() {
  const certifications = await getCertifications()
  return <CertificationsContent certifications={certifications} />
}
