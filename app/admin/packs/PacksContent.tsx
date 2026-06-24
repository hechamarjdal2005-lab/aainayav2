'use client'

import { useState } from 'react'
import { Pack } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import { PackModal } from '@/components/admin/PackModal'
import { formatPrix } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Image from 'next/image'

interface PacksContentProps {
  packs: Pack[]
}

export function PacksContent({ packs: initialPacks }: PacksContentProps) {
  const [packs, setPacks] = useState(initialPacks)
  const [modalOpen, setModalOpen] = useState(false)
  const [editPack, setEditPack] = useState<Pack | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce pack ?')) return
    await supabase.from('packs').delete().eq('id', id)
    setPacks((prev) => prev.filter((p) => p.id !== id))
    router.refresh()
  }

  const handleSaved = async () => {
    const { data } = await supabase
      .from('packs')
      .select('*, pack_produits(*, produits(*))')
      .order('created_at', { ascending: false })
    if (data) setPacks(data)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditPack(null)
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un pack
        </Button>
      </div>

      <Card>
        <Table
          columns={[
            {
              header: 'Image',
              accessor: (p: Pack) =>
                p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.nom}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover h-10 w-10"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center text-outline-variant">
                    🎁
                  </div>
                ),
            },
            { header: 'Nom', accessor: (p: Pack) => p.nom },
            {
              header: 'Prix promo',
              accessor: (p: Pack) => formatPrix(p.prix_promo),
            },
            {
              header: 'Prix origine',
              accessor: (p: Pack) =>
                p.prix_origine ? formatPrix(p.prix_origine) : '-',
            },
            {
              header: 'Produits',
              accessor: (p: Pack) =>
                p.pack_produits?.length
                  ? `${p.pack_produits.length} produits`
                  : '0',
            },
            {
              header: 'Actif',
              accessor: (p: Pack) =>
                p.is_active ? (
                  <span className="text-green-600 font-medium">Oui</span>
                ) : (
                  <span className="text-red-500 font-medium">Non</span>
                ),
            },
            {
              header: 'Actions',
              accessor: (p: Pack) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditPack(p)
                      setModalOpen(true)
                    }}
                    className="text-primary hover:text-primary-dark"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={packs}
          keyExtractor={(p) => p.id}
          emptyMessage="Aucun pack trouvé"
        />
      </Card>

      <PackModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditPack(null)
        }}
        pack={editPack}
        onSaved={handleSaved}
      />
    </div>
  )
}
