'use client'

import { useState } from 'react'
import { Commande } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Table } from '@/components/ui/Table'
import { formatPrix, formatDate, getStatutColor, getStatutLabel, STATUTS } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Eye, Printer } from 'lucide-react'

const statutTabs = [
  { value: 'toutes', label: 'Toutes' },
  ...STATUTS,
]

interface CommandesContentProps {
  commandes: Commande[]
}

export function CommandesContent({ commandes }: CommandesContentProps) {
  const [activeTab, setActiveTab] = useState('toutes')
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null)
  const [updating, setUpdating] = useState(false)
  const supabase = createClient()

  const filtered = activeTab === 'toutes'
    ? commandes
    : commandes.filter((c) => c.statut === activeTab)

  const handleUpdateStatut = async (commandeId: string, newStatut: string) => {
    setUpdating(true)
    await supabase
      .from('commandes')
      .update({ statut: newStatut })
      .eq('id', commandeId)
    setUpdating(false)
    setSelectedCommande(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex gap-2 mb-4 flex-wrap">
          {statutTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? 'bg-primary text-white'
                  : 'bg-surface text-on-surface-variant hover:bg-outline-variant/30'
              }`}
            >
              {tab.label}
              {tab.value !== 'toutes' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({commandes.filter((c) => c.statut === tab.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <Table
          columns={[
            { header: 'Client', accessor: (c: Commande) => c.nom_client },
            {
              header: 'Date',
              accessor: (c: Commande) => formatDate(c.created_at),
            },
            {
              header: 'Total',
              accessor: (c: Commande) => formatPrix(c.total),
            },
            {
              header: 'Statut',
              accessor: (c: Commande) => (
                <Badge className={getStatutColor(c.statut)}>
                  {getStatutLabel(c.statut)}
                </Badge>
              ),
            },
            {
              header: 'Actions',
              accessor: (c: Commande) => (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCommande(c)}
                    className="text-primary hover:text-primary-dark transition-colors"
                    title="Voir détails"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <a
                    href={`/admin/commandes/${c.id}/facture`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark transition-colors"
                    title="Imprimer facture"
                  >
                    <Printer className="h-4 w-4" />
                  </a>
                </div>
              ),
            },
          ]}
          data={filtered}
          keyExtractor={(c) => c.id}
          emptyMessage="Aucune commande trouvée"
        />
      </Card>

      <Modal
        open={!!selectedCommande}
        onClose={() => setSelectedCommande(null)}
        title="Détails de la commande"
        className="max-w-2xl"
      >
        {selectedCommande && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-on-surface-variant">Client</p>
                <p className="font-medium">{selectedCommande.nom_client}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Téléphone</p>
                <p className="font-medium">{selectedCommande.telephone}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Ville</p>
                <p className="font-medium">{selectedCommande.ville || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Adresse</p>
                <p className="font-medium">{selectedCommande.adresse || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Date</p>
                <p className="font-medium">
                  {formatDate(selectedCommande.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">Statut</p>
                <Badge className={getStatutColor(selectedCommande.statut)}>
                  {getStatutLabel(selectedCommande.statut)}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-on-surface mb-2">Articles</p>
              <div className="space-y-2">
                {selectedCommande.commande_items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-outline-variant/10"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {item.produits?.nom || item.packs?.nom || 'Article'}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        x{item.quantite}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">
                      {formatPrix(item.prix_unitaire)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 mt-2 border-t border-outline-variant/30">
                <p className="font-semibold">Total</p>
                <p className="font-bold text-lg text-primary">
                  {formatPrix(selectedCommande.total)}
                </p>
              </div>
            </div>

            {selectedCommande.notes && (
              <div>
                <p className="text-sm text-on-surface-variant">Notes</p>
                <p className="text-sm">{selectedCommande.notes}</p>
              </div>
            )}

            <div className="pt-2">
              <p className="text-sm font-medium text-on-surface mb-2">
                Modifier le statut
              </p>
              <div className="flex gap-2 flex-wrap">
                {STATUTS.map((s) => (
                  <Button
                    key={s.value}
                    size="sm"
                    variant={
                      selectedCommande.statut === s.value ? 'primary' : 'outline'
                    }
                    loading={updating}
                    onClick={() =>
                      handleUpdateStatut(selectedCommande.id, s.value)
                    }
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
