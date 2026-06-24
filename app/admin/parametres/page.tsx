import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from './SettingsForm'
import { Setting } from '@/types'

async function getSettings() {
  const supabase = createClient()
  const { data } = await supabase.from('settings').select('*').single()
  return data as Setting | null
}

export default async function ParametresPage() {
  const settings = await getSettings()
  return <SettingsForm settings={settings} />
}
