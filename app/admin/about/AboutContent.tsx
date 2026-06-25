'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

type AboutForm = {
  id?: string
  title_fr: string
  title_ar: string
  subtitle_fr: string
  subtitle_ar?: string
  story_fr: string
  story_ar: string
  mission_fr: string
  mission_ar?: string
  image_url: string | null
  founded_year: string
  products_count: string
  clients_count: string
  is_active: boolean
}

const defaultForm: AboutForm = {
  title_fr: '3INAYA Cosmétique',
  title_ar: 'عناية كوزميتيك',
  subtitle_fr: "L'art du rituel de beauté marocain",
  subtitle_ar: '',
  story_fr:
    'Née d une passion profonde pour les rituels de beauté ancestraux marocains, 3INAYA propose des produits soigneusement sélectionnés et fabriqués artisanalement au cœur du Maroc.',
  story_ar:
    'وُلدت عناية من شغف عميق بطقوس التجميل المغربية العريقة. نقدم منتجات مختارة بعناية ومصنوعة يدوياً في قلب المغرب.',
  mission_fr:
    'Notre mission est de vous offrir le meilleur des cosmétiques naturels marocains, certifiés et authentiques.',
  mission_ar: '',
  image_url: null,
  founded_year: '2020',
  products_count: '50+',
  clients_count: '1000+',
  is_active: true,
}

async function uploadImage(file: File) {
  const supabase = createClient()
  const fileName = `about-${Date.now()}.${file.name.split('.').pop()}`
  const { error } = await supabase.storage
    .from('site-media')
    .upload(fileName, file, { upsert: true })
  if (error) throw error
  const {
    data: { publicUrl },
  } = supabase.storage.from('site-media').getPublicUrl(fileName)
  return publicUrl
}

export function AboutContent() {
  const [form, setForm] = useState<AboutForm>(defaultForm)
  const [preview, setPreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    supabase
      .from('about_us')
      .select('*')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm(data as AboutForm)
          setPreview(data.image_url)
        }
      })
  }, [supabase])

  const setField = (field: keyof AboutForm, value: string | boolean | null) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
    setSaved(false)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const image_url = imageFile ? await uploadImage(imageFile) : form.image_url
      const payload = {
        ...form,
        image_url,
        updated_at: new Date().toISOString(),
      }

      if (form.id) {
        await supabase.from('about_us').update(payload).eq('id', form.id)
      } else {
        const { data } = await supabase
          .from('about_us')
          .insert(payload)
          .select()
          .single()
        if (data) setForm(data as AboutForm)
      }

      setForm((prev) => ({ ...prev, image_url }))
      setSaved(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl p-8">
      <h1 className="mb-8 text-2xl font-bold text-[#8B2635]">
        À propos de 3INAYA
      </h1>

      <div className="mb-8">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Photo principale
        </label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {preview && (
          <Image
            src={preview}
            alt="Photo principale"
            width={192}
            height={240}
            className="mt-2 h-60 w-48 rounded-xl object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Titre (Français)</label>
          <input
            value={form.title_fr}
            onChange={(e) => setField('title_fr', e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">العنوان (عربي)</label>
          <input
            value={form.title_ar}
            onChange={(e) => setField('title_ar', e.target.value)}
            className="w-full rounded-xl border p-3 text-right"
            dir="rtl"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Sous-titre</label>
        <input
          value={form.subtitle_fr}
          onChange={(e) => setField('subtitle_fr', e.target.value)}
          className="w-full rounded-xl border p-3"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Sous-titre AR</label>
        <input
          value={form.subtitle_ar || ''}
          onChange={(e) => setField('subtitle_ar', e.target.value)}
          className="w-full rounded-xl border p-3 text-right"
          dir="rtl"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Histoire (Français)</label>
        <textarea
          rows={5}
          value={form.story_fr}
          onChange={(e) => setField('story_fr', e.target.value)}
          className="w-full rounded-xl border p-3"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">القصة (عربي)</label>
        <textarea
          rows={5}
          value={form.story_ar}
          onChange={(e) => setField('story_ar', e.target.value)}
          className="w-full rounded-xl border p-3 text-right"
          dir="rtl"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Mission</label>
        <textarea
          rows={3}
          value={form.mission_fr}
          onChange={(e) => setField('mission_fr', e.target.value)}
          className="w-full rounded-xl border p-3"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium">Mission AR</label>
        <textarea
          rows={3}
          value={form.mission_ar || ''}
          onChange={(e) => setField('mission_ar', e.target.value)}
          className="w-full rounded-xl border p-3 text-right"
          dir="rtl"
        />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Année de fondation
          </label>
          <input
            value={form.founded_year}
            onChange={(e) => setField('founded_year', e.target.value)}
            className="w-full rounded-xl border p-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Nombre de produits
          </label>
          <input
            value={form.products_count}
            onChange={(e) => setField('products_count', e.target.value)}
            placeholder="50+"
            className="w-full rounded-xl border p-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">
            Nombre de clients
          </label>
          <input
            value={form.clients_count}
            onChange={(e) => setField('clients_count', e.target.value)}
            placeholder="1000+"
            className="w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="rounded-xl bg-[#8B2635] px-8 py-3 font-semibold text-white hover:bg-[#7A2333] disabled:opacity-60"
      >
        {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
      </button>
      {saved && <span className="ml-4 text-sm text-green-600">Enregistré</span>}
    </div>
  )
}
