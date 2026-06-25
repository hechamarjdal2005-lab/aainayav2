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
import { Plus, Pencil, Trash2, Package } from 'lucide-react'
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

  const getOriginalPrice = (p: Pack) => p.prix_origine || p.original_price || 0
  const getSalePrice = (p: Pack) => p.prix_promo || p.sale_price || 0
  const getReduction = (p: Pack) => {
    const original = getOriginalPrice(p)
    const sale = getSalePrice(p)
    return original > sale && original > 0
      ? Math.round(((original - sale) / original) * 100)
      : 0
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditPack(null)
            setModalOpen(true)
          }}
          className="bg-[#8B2635] hover:bg-[#7A2333]"
        >
          <Plus className="mr-2 h-4 w-4" />
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
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-surface">
                    <Package className="h-4 w-4 text-outline-variant" />
                  </div>
                ),
            },
            { header: 'Nom', accessor: (p: Pack) => p.nom || p.name },
            {
              header: 'Prix original',
              accessor: (p: Pack) => formatPrix(getOriginalPrice(p)),
            },
            {
              header: 'Prix remisé',
              accessor: (p: Pack) => formatPrix(getSalePrice(p)),
            },
            {
              header: 'Réduction',
              accessor: (p: Pack) => `${getReduction(p)}%`,
            },
            {
              header: 'Stock',
              accessor: (p: Pack) => p.stock_quantity ?? p.stock ?? 0,
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
                    aria-label="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Supprimer"
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
