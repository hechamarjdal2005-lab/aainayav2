import { createClient } from '@/lib/supabase/server'
import { CertificationsContent } from './CertificationsContent'

async function getCertifications() {
  const supabase = createClient()
  const { data } = await supabase
    .from('certifications')
    .select('*')
    .order('ordre')
  return data || []
}

export default async function CertificationsPage() {
  const certifications = await getCertifications()
  return <CertificationsContent certifications={certifications} />
}
