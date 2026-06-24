'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Category, Produit } from '@/types'

const schema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  conseils_utilisation: z.string().optional(),
  prix: z.coerce.number().positive('Le prix doit être positif'),
  stock: z.coerce.number().int().min(0, 'Le stock ne peut être négatif'),
  categorie_id: z.string().optional(),
  is_active: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

interface ProduitModalProps {
  open: boolean
  onClose: () => void
  produit?: Produit | null
  onSaved: () => void
}

export function ProduitModal({ open, onClose, produit, onSaved }: ProduitModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
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
      ingredients: '',
      conseils_utilisation: '',
      prix: 0,
      stock: 0,
      categorie_id: '',
      is_active: true,
    },
  })

  useEffect(() => {
    if (open) {
      loadCategories()
      if (produit) {
        reset({
          nom: produit.nom,
          description: produit.description || '',
          ingredients: produit.ingredients || '',
          conseils_utilisation: produit.conseils_utilisation || '',
          prix: produit.prix,
          stock: produit.stock,
          categorie_id: produit.categorie_id || '',
          is_active: produit.is_active,
        })
        setImagePreview(produit.image_url)
      } else {
        reset()
        setImagePreview(null)
      }
      setImageFile(null)
    }
  }, [open, produit])

  async function loadCategories() {
    const { data } = await supabase.from('categories').select('*').order('nom')
    if (data) setCategories(data)
  }

  async function uploadImage(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data, error } = await supabase.storage
      .from('produits-images')
      .upload(fileName, file)
    if (error) {
      console.error(error)
      return null
    }
    const { data: urlData } = supabase.storage
      .from('produits-images')
      .getPublicUrl(data.path)
    return urlData.publicUrl
  }

  async function deleteOldImage(url: string | null) {
    if (!url) return
    const path = url.split('/').pop()
    if (path) {
      await supabase.storage.from('produits-images').remove([path])
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      let image_url = produit?.image_url || null

      if (imageFile) {
        if (produit?.image_url) {
          await deleteOldImage(produit.image_url)
        }
        image_url = await uploadImage(imageFile)
      }

      if (produit) {
        await supabase
          .from('produits')
          .update({
            ...data,
            categorie_id: data.categorie_id || null,
            image_url,
          })
          .eq('id', produit.id)
      } else {
        await supabase.from('produits').insert({
          ...data,
          categorie_id: data.categorie_id || null,
          image_url,
        })
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
    <Modal open={open} onClose={onClose} title={produit ? 'Modifier le produit' : 'Ajouter un produit'}>
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
            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            rows={3}
            {...register('description')}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-on-surface">
            Ingrédients
          </label>
          <textarea
            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            rows={2}
            {...register('ingredients')}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-on-surface">
            Conseils d&apos;utilisation
          </label>
          <textarea
            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            rows={2}
            {...register('conseils_utilisation')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="prix"
            label="Prix (MAD)"
            type="number"
            step="0.01"
            error={errors.prix?.message}
            {...register('prix')}
          />
          <Input
            id="stock"
            label="Stock"
            type="number"
            error={errors.stock?.message}
            {...register('stock')}
          />
        </div>

        <Select
          id="categorie_id"
          label="Catégorie"
          placeholder="Sélectionner une catégorie"
          options={categories.map((c) => ({ value: c.id, label: c.nom }))}
          {...register('categorie_id')}
        />

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
            {produit ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
