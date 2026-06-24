'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Pack, Produit } from '@/types'

const schema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  prix_promo: z.coerce.number().positive('Le prix doit être positif'),
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

export function PackModal({ open, onClose, pack, onSaved }: PackModalProps) {
  const [produits, setProduits] = useState<Produit[]>([])
  const [selectedProduits, setSelectedProduits] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      nom: '',
      description: '',
      prix_promo: 0,
      categorie: '',
      is_active: true,
    },
  })

  useEffect(() => {
    if (open) {
      loadProduits()
      if (pack) {
        reset({
          nom: pack.nom,
          description: pack.description || '',
          prix_promo: pack.prix_promo,
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
    }
  }, [open, pack])

  async function loadProduits() {
    const { data } = await supabase
      .from('produits')
      .select('*')
      .order('nom')
    if (data) setProduits(data)
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from('packs-images')
      .upload(fileName, file)
    if (error) return null
    const { data: urlData } = supabase.storage
      .from('packs-images')
      .getPublicUrl(data.path)
    return urlData.publicUrl
  }

  function toggleProduit(produitId: string) {
    setSelectedProduits((prev) => {
      if (prev[produitId]) {
        const { [produitId]: _, ...rest } = prev
        return rest
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

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      let image_url = pack?.image_url || null

      if (imageFile) {
        image_url = await uploadImage(imageFile)
      }

      const packData = {
        ...data,
        categorie: data.categorie || null,
        image_url,
      }

      if (pack) {
        await supabase.from('packs').update(packData).eq('id', pack.id)
        const packId = pack.id

        await supabase.from('pack_produits').delete().eq('pack_id', packId)
        const inserts = Object.entries(selectedProduits).map(
          ([produit_id, quantite]) => ({
            pack_id: packId,
            produit_id,
            quantite,
          })
        )
        if (inserts.length > 0) {
          await supabase.from('pack_produits').insert(inserts)
        }
      } else {
        const { data: newPack } = await supabase
          .from('packs')
          .insert(packData)
          .select()
          .single()

        if (newPack) {
          const inserts = Object.entries(selectedProduits).map(
            ([produit_id, quantite]) => ({
              pack_id: newPack.id,
              produit_id,
              quantite,
            })
          )
          if (inserts.length > 0) {
            await supabase.from('pack_produits').insert(inserts)
          }
        }
      }

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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={pack ? 'Modifier le pack' : 'Ajouter un pack'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="nom"
          label="Nom"
          error={errors.nom?.message}
          {...register('nom')}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-on-surface">
            Description
          </label>
          <textarea
            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            rows={3}
            {...register('description')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="prix_promo"
            label="Prix promo (MAD)"
            type="number"
            step="0.01"
            error={errors.prix_promo?.message}
            {...register('prix_promo')}
          />
          <Input
            id="categorie"
            label="Catégorie"
            {...register('categorie')}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-on-surface">
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 h-32 w-32 object-cover rounded-lg"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-on-surface mb-2">
            Produits dans le pack
          </label>
          <div className="max-h-48 overflow-y-auto border border-outline-variant/30 rounded-lg p-2 space-y-1">
            {produits.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-3 px-2 py-1.5 hover:bg-surface-card rounded cursor-pointer"
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
                    className="w-16 rounded border border-outline-variant px-2 py-1 text-xs text-center"
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
