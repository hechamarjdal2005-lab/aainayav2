'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { Certification } from '@/types'

interface CertifModalProps {
  open: boolean
  onClose: () => void
  certification?: Certification | null
  onSaved: () => void
  currentCount?: number
}

type FormState = {
  name: string
  title_fr: string
  title_ar: string
  display_order: number
  is_active: boolean
}

const defaultForm: FormState = {
  name: '',
  title_fr: '',
  title_ar: '',
  display_order: 0,
  is_active: true,
}

async function uploadImage(file: File) {
  const supabase = createClient()
  const fileName = `cert-${Date.now()}.${file.name.split('.').pop()}`
  const { error } = await supabase.storage
    .from('site-media')
    .upload(fileName, file, { upsert: true })
  if (error) throw error
  const {
    data: { publicUrl },
  } = supabase.storage.from('site-media').getPublicUrl(fileName)
  return publicUrl
}

export function CertifModal({
  open,
  onClose,
  certification,
  onSaved,
  currentCount = 0,
}: CertifModalProps) {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!open) return
    if (certification) {
      setForm({
        name: certification.name || certification.nom || '',
        title_fr: certification.title_fr || certification.name || certification.nom || '',
        title_ar: certification.title_ar || '',
        display_order: certification.display_order ?? certification.ordre ?? 0,
        is_active: certification.is_active,
      })
      setPreview(certification.image_url || certification.logo_url || null)
    } else {
      setForm(defaultForm)
      setPreview(null)
    }
    setImageFile(null)
    setError(null)
  }, [open, certification])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certification && currentCount >= 3) {
      setError('Maximum 3 certifications autorisees.')
      return
    }
    if (!certification && !imageFile) {
      setError('Veuillez ajouter une image.')
      return
    }

    setLoading(true)
    try {
      const imageUrl = imageFile
        ? await uploadImage(imageFile)
        : certification?.image_url || certification?.logo_url || null
      const payload = {
        name: form.name,
        nom: form.name,
        title_fr: form.title_fr || form.name,
        title_ar: form.title_ar || null,
        logo_url: imageUrl,
        image_url: imageUrl,
        display_order: form.display_order,
        ordre: form.display_order,
        is_active: form.is_active,
      }

      if (certification) {
        await supabase.from('certifications').update(payload).eq('id', certification.id)
      } else {
        await supabase.from('certifications').insert(payload)
      }
      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
      setError("Impossible d'enregistrer la certification.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={certification ? 'Modifier la certification' : 'Ajouter une certification'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <Input id="name" label="Nom interne" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <Input id="title_fr" label="Titre FR" value={form.title_fr} onChange={(e) => setForm((p) => ({ ...p, title_fr: e.target.value }))} />
        <Input id="title_ar" label="Titre AR" dir="rtl" value={form.title_ar} onChange={(e) => setForm((p) => ({ ...p, title_ar: e.target.value }))} />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-on-surface">Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-on-surface-variant file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20" />
          {preview && (
            <div className="mt-2 flex h-28 w-28 items-center justify-center rounded-xl bg-white p-3 shadow-sm">
              <Image src={preview} alt="Certification preview" width={96} height={96} className="h-full w-full object-contain" unoptimized />
            </div>
          )}
        </div>
        <Input id="display_order" label="Ordre" type="number" value={form.display_order} onChange={(e) => setForm((p) => ({ ...p, display_order: Number(e.target.value) || 0 }))} />
        <label className="flex items-center gap-2 text-sm text-on-surface">
          <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="rounded border-outline-variant" />
          Active
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
          <Button type="submit" loading={loading}>{certification ? 'Modifier' : 'Ajouter'}</Button>
        </div>
      </form>
    </Modal>
  )
}
