'use client'

import { Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/types'
import { createCategorie, updateCategorie } from '@/lib/actions/categories'

const schema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
})

type FormData = z.infer<typeof schema>

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface CategoryModalProps {
  open: boolean
  onClose: () => void
  category?: Category | null
  onSaved: (category: Category) => void
}

export function CategoryModal({ open, onClose, category, onSaved }: CategoryModalProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      nom: '',
      slug: '',
    },
  })
  useEffect(() => {
    if (open) {
      if (category) {
        reset({ nom: category.nom, slug: category.slug })
      } else {
        reset({ nom: '', slug: '' })
      }
    }
  }, [open, category, reset])

  const handleNomChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      setValue('nom', val)
      if (!category) {
        setValue('slug', slugify(val))
      }
    },
    [category, setValue]
  )

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      if (category) {
        const formData = new FormData()
        formData.append('nom', data.nom)
        formData.append('slug', data.slug)
        const result = await updateCategorie(category.id, formData)
        if (result.error) {
          alert(result.error)
          return
        }
        onSaved({ ...category, nom: data.nom, slug: data.slug })
      } else {
        const formData = new FormData()
        formData.append('nom', data.nom)
        formData.append('slug', data.slug)
        const result = await createCategorie(formData)
        if (result.error) {
          alert(result.error)
          return
        }
        const { data: newCat } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', data.slug)
          .single()
        if (newCat) onSaved(newCat as unknown as Category)
      }
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="nom"
          label="Nom"
          error={errors.nom?.message}
          {...register('nom', { onChange: handleNomChange })}
        />

        <Input
          id="slug"
          label="Slug"
          error={errors.slug?.message}
          {...register('slug')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={loading}>
            {category ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
