'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pack, Produit } from '@/types'
import Image from 'next/image'
import { Search } from 'lucide-react'

const schema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  name_fr: z.string().optional(),
  name_ar: z.string().optional(),
  slug: z.string().min(1, 'Le slug est requis'),
  description: z.string().optional(),
  description_fr: z.string().optional(),
  description_ar: z.string().optional(),
  prix_origine: z.coerce.number().positive('Le prix original doit être positif'),
  prix_promo: z.coerce.number().positive('Le prix remisé doit être positif'),
  stock_quantity: z.coerce.number().int().min(0, 'Le stock ne peut être négatif'),
  categorie: z.string().optional(),
  is_active: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

interface PackModalProps {
  open: boolean
  onClose: () => void
  pack?: Pack | null
  onSaved: () => void
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function PackModal({ open, onClose, pack, onSaved }: PackModalProps) {
  const [produits, setProduits] = useState<Produit[]>([])
  const [selectedProduits, setSelectedProduits] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const supabase = useMemo(() => createClient(), [])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof schema>, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom: '',
      name_fr: '',
      name_ar: '',
      slug: '',
      description: '',
      description_fr: '',
      description_ar: '',
      prix_origine: 0,
      prix_promo: 0,
      stock_quantity: 0,
      categorie: '',
      is_active: true,
    },
  })

  const nom = watch('nom')
  const originalPrice = Number(watch('prix_origine') || 0)
  const salePrice = Number(watch('prix_promo') || 0)
  const discount =
    originalPrice > 0 && salePrice > 0
      ? Math.max(0, Math.round((1 - salePrice / originalPrice) * 100))
      : 0

  const loadProduits = useCallback(async () => {
    const { data } = await supabase.from('produits').select('*').order('nom')
    if (data) setProduits(data)
  }, [supabase])

  useEffect(() => {
    if (!open) return
    loadProduits()
    if (pack) {
      reset({
        nom: pack.nom,
        name_fr: pack.name_fr || pack.nom,
        name_ar: pack.name_ar || '',
        slug: pack.slug || slugify(pack.nom),
        description: pack.description || '',
        description_fr: pack.description_fr || pack.description || '',
        description_ar: pack.description_ar || '',
        prix_origine: pack.prix_origine || pack.prix_promo,
        prix_promo: pack.prix_promo,
        stock_quantity: pack.stock_quantity || 0,
        categorie: pack.categorie || '',
        is_active: pack.is_active,
      })
      setImagePreview(pack.image_url)

      const selected: Record<string, number> = {}
      pack.pack_produits?.forEach((pp) => {
        if (pp.produit_id) selected[pp.produit_id] = pp.quantite
      })
      setSelectedProduits(selected)
    } else {
      reset()
      setSelectedProduits({})
      setImagePreview(null)
    }
    setImageFile(null)
    setSearch('')
  }, [open, pack, reset, loadProduits])

  useEffect(() => {
    if (!pack && nom) setValue('slug', slugify(nom), { shouldValidate: true })
  }, [nom, pack, setValue])

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from('site-media')
      .upload(fileName, file)
    if (error) return null
    const { data: urlData } = supabase.storage
      .from('site-media')
      .getPublicUrl(data.path)
    return urlData.publicUrl
  }

  function toggleProduit(produitId: string) {
    setSelectedProduits((prev) => {
      if (prev[produitId]) {
        const next = { ...prev }
        delete next[produitId]
        return next
      }
      return { ...prev, [produitId]: 1 }
    })
  }

  function updateQuantite(produitId: string, qty: number) {
    setSelectedProduits((prev) => ({
      ...prev,
      [produitId]: Math.max(1, qty),
    }))
  }

  async function savePack(packData: Record<string, unknown>) {
    const frenchData = { ...packData }
    delete frenchData.name
    delete frenchData.slug
    delete frenchData.original_price
    delete frenchData.sale_price
    delete frenchData.stock_quantity

    const englishData = { ...packData }
    delete englishData.nom
    delete englishData.prix_origine
    delete englishData.prix_promo
    delete englishData.categorie

    if (pack) {
      const result = await supabase.from('packs').update(packData).eq('id', pack.id)
      if (!result.error) return pack.id

      const frenchRetry = await supabase.from('packs').update(frenchData).eq('id', pack.id)
      if (!frenchRetry.error) return pack.id

      const englishRetry = await supabase.from('packs').update(englishData).eq('id', pack.id)
      if (englishRetry.error) throw englishRetry.error
      return pack.id
    }

    const result = await supabase.from('packs').insert(packData).select().single()
    if (result.data) return result.data.id as string

    const frenchRetry = await supabase.from('packs').insert(frenchData).select().single()
    if (frenchRetry.data) return frenchRetry.data.id as string

    const englishRetry = await supabase.from('packs').insert(englishData).select().single()
    if (englishRetry.error) throw englishRetry.error
    return englishRetry.data.id as string
  }

  async function savePackItems(packId: string) {
    const frenchInserts = Object.entries(selectedProduits).map(
      ([produit_id, quantite]) => ({
        pack_id: packId,
        produit_id,
        quantite,
      })
    )
    const englishInserts = Object.entries(selectedProduits).map(
      ([product_id, quantity]) => ({
        pack_id: packId,
        product_id,
        quantity,
      })
    )

    await supabase.from('pack_produits').delete().eq('pack_id', packId)
    await supabase.from('pack_items').delete().eq('pack_id', packId)

    if (frenchInserts.length === 0) return

    const french = await supabase.from('pack_produits').insert(frenchInserts)
    if (!french.error) return

    await supabase.from('pack_items').insert(englishInserts)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      let image_url = pack?.image_url || null

      if (imageFile) image_url = await uploadImage(imageFile)

      const packData = {
        nom: data.nom,
        name: data.nom,
        name_fr: data.name_fr || data.nom,
        name_ar: data.name_ar || null,
        slug: data.slug,
        description: data.description || null,
        description_fr: data.description_fr || data.description || null,
        description_ar: data.description_ar || null,
        prix_origine: data.prix_origine,
        original_price: data.prix_origine,
        prix_promo: data.prix_promo,
        sale_price: data.prix_promo,
        stock_quantity: data.stock_quantity,
        categorie: data.categorie || null,
        image_url,
        is_active: data.is_active ?? true,
      }

      const packId = await savePack(packData)
      await savePackItems(packId)

      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const filteredProduits = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return produits
    return produits.filter((p) => p.nom.toLowerCase().includes(term))
  }, [produits, search])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={pack ? 'Modifier le pack' : 'Ajouter un pack'}
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input id="nom" label="Nom" error={errors.nom?.message} {...register('nom')} />
          <Input
            id="slug"
            label="Slug"
            error={errors.slug?.message}
            {...register('slug')}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input id="name_fr" label="Nom FR" {...register('name_fr')} />
          <Input id="name_ar" label="Nom AR" dir="rtl" {...register('name_ar')} />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-on-surface">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            rows={3}
            {...register('description')}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-on-surface">
              Description FR
            </label>
            <textarea
              className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface"
              rows={3}
              {...register('description_fr')}
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-on-surface">
              Description AR
            </label>
            <textarea
              className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-right text-sm text-on-surface"
              rows={3}
              dir="rtl"
              {...register('description_ar')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            id="prix_origine"
            label="Prix original (MAD)"
            type="number"
            step="0.01"
            error={errors.prix_origine?.message}
            {...register('prix_origine')}
          />
          <Input
            id="prix_promo"
            label="Prix remisé (MAD)"
            type="number"
            step="0.01"
            error={errors.prix_promo?.message}
            {...register('prix_promo')}
          />
          <Input
            id="stock_quantity"
            label="Stock"
            type="number"
            error={errors.stock_quantity?.message}
            {...register('stock_quantity')}
          />
        </div>

        <div className="rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          Remise calculée: {discount}%
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-on-surface">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-on-surface-variant file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/20"
          />
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Preview"
              width={128}
              height={128}
              className="mt-2 h-32 w-32 rounded-lg object-cover"
              unoptimized
            />
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-on-surface">
            Produits inclus
          </label>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit"
              className="w-full rounded-lg border border-outline-variant bg-white py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-outline-variant/30 p-2">
            {filteredProduits.map((p) => (
              <label
                key={p.id}
                className="flex cursor-pointer items-center gap-3 rounded px-2 py-1.5 hover:bg-surface"
              >
                <input
                  type="checkbox"
                  checked={!!selectedProduits[p.id]}
                  onChange={() => toggleProduit(p.id)}
                  className="rounded border-outline-variant"
                />
                <span className="flex-1 text-sm text-on-surface">{p.nom}</span>
                {selectedProduits[p.id] && (
                  <input
                    type="number"
                    min={1}
                    value={selectedProduits[p.id]}
                    onChange={(e) =>
                      updateQuantite(p.id, parseInt(e.target.value) || 1)
                    }
                    className="w-16 rounded border border-outline-variant px-2 py-1 text-center text-xs"
                  />
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            className="rounded border-outline-variant"
            {...register('is_active')}
          />
          <label htmlFor="is_active" className="text-sm text-on-surface">
            Actif
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={loading}>
            {pack ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
