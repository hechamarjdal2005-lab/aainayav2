'use client'

import { useState } from 'react'
import { Certification } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import { CertifModal } from '@/components/admin/CertifModal'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const iconMap: Record<string, string> = {
  leaf: '🌿',
  'map-pin': '📍',
  heart: '❤️',
  truck: '🚚',
  verified: '✅',
}

interface CertificationsContentProps {
  certifications: Certification[]
}

export function CertificationsContent({ certifications: initial }: CertificationsContentProps) {
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
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .order('ordre')
    if (data) setCertifications(data)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditCertif(null)
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une certification
        </Button>
      </div>

      <Card>
        <Table
          columns={[
            {
              header: 'Icône',
              accessor: (c: Certification) => (
                <span className="text-xl">{iconMap[c.icone] || '✅'}</span>
              ),
            },
            { header: 'Nom', accessor: (c: Certification) => c.nom },
            {
              header: 'Description',
              accessor: (c: Certification) => c.description || '-',
            },
            { header: 'Ordre', accessor: (c: Certification) => c.ordre },
            {
              header: 'Active',
              accessor: (c: Certification) =>
                c.is_active ? (
                  <span className="text-green-600 font-medium">Oui</span>
                ) : (
                  <span className="text-red-500 font-medium">Non</span>
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
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500 hover:text-red-700"
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
      />
    </div>
  )
}
