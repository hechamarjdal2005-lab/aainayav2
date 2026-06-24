'use client'

import { useState } from 'react'
import { Produit, Category } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import { ProduitModal } from '@/components/admin/ProduitModal'
import { formatPrix } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ProduitsContentProps {
  produits: Produit[]
  categories: Category[]
}

export function ProduitsContent({ produits: initialProduits, categories }: ProduitsContentProps) {
  const [produits, setProduits] = useState(initialProduits)
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduit, setEditProduit] = useState<Produit | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return
    await supabase.from('produits').delete().eq('id', id)
    setProduits((prev) => prev.filter((p) => p.id !== id))
    router.refresh()
  }

  const handleSaved = async () => {
    const { data } = await supabase
      .from('produits')
      .select('*, categories(*)')
      .order('created_at', { ascending: false })
    if (data) setProduits(data)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditProduit(null)
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>

      <Card>
        <Table
          columns={[
            {
              header: 'Image',
              accessor: (p: Produit) =>
                p.image_url ? (
                  <Image
                    src={p.image_url}
                    alt={p.nom}
                    width={40}
                    height={40}
                    className="rounded-lg object-cover h-10 w-10"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center">
                    <ImageIcon className="h-4 w-4 text-outline-variant" />
                  </div>
                ),
            },
            { header: 'Nom', accessor: (p: Produit) => p.nom },
            {
              header: 'Catégorie',
              accessor: (p: Produit) => p.categories?.nom || '-',
            },
            {
              header: 'Prix',
              accessor: (p: Produit) => formatPrix(p.prix),
            },
            {
              header: 'Stock',
              accessor: (p: Produit) => p.stock,
            },
            {
              header: 'Actif',
              accessor: (p: Produit) =>
                p.is_active ? (
                  <span className="text-green-600 font-medium">Oui</span>
                ) : (
                  <span className="text-red-500 font-medium">Non</span>
                ),
            },
            {
              header: 'Actions',
              accessor: (p: Produit) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditProduit(p)
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
          data={produits}
          keyExtractor={(p) => p.id}
          emptyMessage="Aucun produit trouvé"
        />
      </Card>

      <ProduitModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditProduit(null)
        }}
        produit={editProduit}
        onSaved={handleSaved}
      />
    </div>
  )
}
