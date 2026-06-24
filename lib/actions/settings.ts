'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const settingsSchema = z.object({
  site_name: z.string().min(1, 'Le nom du site est requis'),
  tagline_fr: z.string().optional(),
  tagline_ar: z.string().optional(),
  contact_email: z.string().email('Email invalide').optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram_url: z.string().url('URL invalide').optional().or(z.literal('')),
  facebook_url: z.string().url('URL invalide').optional().or(z.literal('')),
  tiktok_url: z.string().url('URL invalide').optional().or(z.literal('')),
  youtube_url: z.string().url('URL invalide').optional().or(z.literal('')),
  pinterest_url: z.string().url('URL invalide').optional().or(z.literal('')),
  footer_description: z.string().optional(),
  footer_copyright: z.string().optional(),
  about_title: z.string().optional(),
  about_description: z.string().optional(),
  about_image_url: z.string().optional(),
  hero_video_url: z.string().optional(),
  logo_url: z.string().optional(),
})

export type SettingsFormData = z.infer<typeof settingsSchema>

export async function saveSettings(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = settingsSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: 'Données invalides', issues: parsed.error.issues }
  }

  const supabase = createClient()

  const { error } = await supabase.from('settings').upsert(
    { id: 1, ...parsed.data, updated_at: new Date().toISOString() },
    { onConflict: 'id' }
  )

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
