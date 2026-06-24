'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Certification } from '@/types'

const schema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  icone: z.string().optional(),
  ordre: z.coerce.number().int().min(0),
  is_active: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

interface CertifModalProps {
  open: boolean
  onClose: () => void
  certification?: Certification | null
  onSaved: () => void
}

export function CertifModal({ open, onClose, certification, onSaved }: CertifModalProps) {
  const [loading, setLoading] = useState(false)
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
      icone: 'verified',
      ordre: 0,
      is_active: true,
    },
  })

  useEffect(() => {
    if (open) {
      if (certification) {
        reset({
          nom: certification.nom,
          description: certification.description || '',
          icone: certification.icone,
          ordre: certification.ordre,
          is_active: certification.is_active,
        })
      } else {
        reset()
      }
    }
  }, [open, certification])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      if (certification) {
        await supabase
          .from('certifications')
          .update(data)
          .eq('id', certification.id)
      } else {
        await supabase.from('certifications').insert(data)
      }
      onSaved()
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
      title={certification ? 'Modifier la certification' : 'Ajouter une certification'}
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
            rows={2}
            {...register('description')}
          />
        </div>

        <Input
          id="icone"
          label="Icône (lucide-react name)"
          {...register('icone')}
        />

        <Input
          id="ordre"
          label="Ordre"
          type="number"
          error={errors.ordre?.message}
          {...register('ordre')}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            className="rounded border-outline-variant"
            {...register('is_active')}
          />
          <label htmlFor="is_active" className="text-sm text-on-surface">
            Active
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={loading}>
            {certification ? 'Modifier' : 'Ajouter'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
