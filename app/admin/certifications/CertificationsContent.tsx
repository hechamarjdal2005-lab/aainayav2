'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Certification } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import { CertifModal } from '@/components/admin/CertifModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react'

interface CertificationsContentProps {
  certifications: Certification[]
}

export function CertificationsContent({
  certifications: initial,
}: CertificationsContentProps) {
  const [certifications, setCertifications] = useState(initial)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCertif, setEditCertif] = useState<Certification | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette certification ?')) return
    await supabase.from('certifications').delete().eq('id', id)
    setCertifications((prev) => prev.filter((c) => c.id !== id))
    router.refresh()
  }

  const handleSaved = async () => {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('display_order')
    if (data && !error) {
      setCertifications(data)
    } else {
      const fallback = await supabase
        .from('certifications')
        .select('*')
        .order('ordre')
      if (fallback.data) setCertifications(fallback.data)
    }
    router.refresh()
  }

  const canAdd = certifications.length < 3

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          {certifications.length}/3 certifications utilisées
        </p>
        <Button
          onClick={() => {
            if (!canAdd) return
            setEditCertif(null)
            setModalOpen(true)
          }}
          disabled={!canAdd}
          className="bg-[#8B2635] hover:bg-[#7A2333]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une certification
        </Button>
      </div>

      {!canAdd && (
        <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Maximum 3 certifications autorisées. Supprimez ou modifiez une
          certification existante.
        </div>
      )}

      <Card>
        <Table
          columns={[
            {
              header: 'Name',
              accessor: (c: Certification) => c.name || c.nom,
            },
            {
              header: 'Image preview',
              accessor: (c: Certification) =>
                c.logo_url ? (
                  <Image
                    src={c.logo_url}
                    alt={c.name || c.nom}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-lg bg-white object-contain p-2"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-surface">
                    <ImageIcon className="h-5 w-5 text-outline-variant" />
                  </div>
                ),
            },
            {
              header: 'Order',
              accessor: (c: Certification) => c.display_order ?? c.ordre ?? 0,
            },
            {
              header: 'Active',
              accessor: (c: Certification) =>
                c.is_active ? (
                  <span className="font-medium text-green-600">Oui</span>
                ) : (
                  <span className="font-medium text-red-500">Non</span>
                ),
            },
            {
              header: 'Actions',
              accessor: (c: Certification) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditCertif(c)
                      setModalOpen(true)
                    }}
                    className="text-primary hover:text-primary-dark"
                    aria-label="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={certifications}
          keyExtractor={(c) => c.id}
          emptyMessage="Aucune certification"
        />
      </Card>

      <CertifModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditCertif(null)
        }}
        certification={editCertif}
        onSaved={handleSaved}
        currentCount={certifications.length}
      />
    </div>
  )
}
