'use client'

import { useState } from 'react'
import { Category } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import { CategoryModal } from '@/components/admin/CategoryModal'
import { deleteCategorie } from '@/lib/actions/categories'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface CategoriesContentProps {
  categories: Category[]
}

export function CategoriesContent({ categories: initial }: CategoriesContentProps) {
  const [categories, setCategories] = useState(initial)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return

    const result = await deleteCategorie(id)
    if (result.error) {
      alert(result.error)
      return
    }

    setCategories((prev) => prev.filter((c) => c.id !== id))
    router.refresh()
  }

  const handleSaved = (category: Category) => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === category.id)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = category
        return updated
      }
      return [...prev, category]
    })
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditCategory(null)
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une catégorie
        </Button>
      </div>

      <Card>
        <Table
          columns={[
            { header: 'Nom', accessor: (c: Category) => c.nom },
            { header: 'Slug', accessor: (c: Category) => c.slug },
            {
              header: 'Date création',
              accessor: (c: Category) =>
                new Date(c.created_at).toLocaleDateString('fr-FR'),
            },
            {
              header: 'Actions',
              accessor: (c: Category) => (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditCategory(c)
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
          data={categories}
          keyExtractor={(c) => c.id}
          emptyMessage="Aucune catégorie"
        />
      </Card>

      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditCategory(null)
        }}
        category={editCategory}
        onSaved={handleSaved}
      />
    </div>
  )
}
