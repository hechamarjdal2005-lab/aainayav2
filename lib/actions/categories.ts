'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const categorySchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
})

export type CategoryFormData = z.infer<typeof categorySchema>

export async function createCategorie(formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = categorySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: 'Données invalides', issues: parsed.error.issues }
  }

  const supabase = createClient()

  const { error } = await supabase.from('categories').insert(parsed.data)

  if (error) return { error: error.message }

  revalidatePath('/shop')
  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function updateCategorie(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData)
  const parsed = categorySchema.safeParse(raw)

  if (!parsed.success) {
    return { error: 'Données invalides', issues: parsed.error.issues }
  }

  const supabase = createClient()

  const { error } = await supabase
    .from('categories')
    .update(parsed.data)
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/shop')
  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategorie(id: string) {
  const supabase = createClient()

  const { count } = await supabase
    .from('produits')
    .select('*', { count: 'exact', head: true })
    .eq('categorie_id', id)

  if (count && count > 0) {
    return {
      error: `Impossible de supprimer cette catégorie : ${count} produit(s) l'utilisent encore.`,
    }
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/shop')
  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true }
}
