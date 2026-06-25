'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Order } from '@/types'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { formatPrix, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { FileText } from 'lucide-react'

const statuses = [
  { value: 'pending', label: 'En attente', className: 'bg-amber-100 text-amber-800' },
  { value: 'confirmed', label: 'Confirmée', className: 'bg-blue-100 text-blue-800' },
  { value: 'delivered', label: 'Livrée', className: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Annulée', className: 'bg-red-100 text-red-800' },
] as const

function statusMeta(status: string) {
  return statuses.find((s) => s.value === status) || statuses[0]
}

interface CommandesContentProps {
  commandes: Order[]
}

export function CommandesContent({ commandes: initialCommandes }: CommandesContentProps) {
  const [commandes, setCommandes] = useState(initialCommandes)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const supabase = createClient()

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    setUpdatingId(orderId)
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
    if (!error) {
      setCommandes((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status } : order))
      )
    }
    setUpdatingId(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <Table
          columns={[
            {
              header: 'Numéro',
              accessor: (order: Order) => order.order_number,
            },
            {
              header: 'Client',
              accessor: (order: Order) => order.client_name,
            },
            {
              header: 'Téléphone',
              accessor: (order: Order) => order.phone,
            },
            {
              header: 'Adresse',
              accessor: (order: Order) => (
                <span className="line-clamp-1 max-w-[220px]">{order.address}</span>
              ),
            },
            {
              header: 'Total',
              accessor: (order: Order) => formatPrix(order.total),
            },
            {
              header: 'Statut',
              accessor: (order: Order) => {
                const meta = statusMeta(order.status)
                return <Badge className={meta.className}>{meta.label}</Badge>
              },
            },
            {
              header: 'Date',
              accessor: (order: Order) => formatDate(order.created_at),
            },
            {
              header: 'Actions',
              accessor: (order: Order) => (
                <div className="flex min-w-[210px] items-center gap-2">
                  <Link
                    href={`/admin/commandes/${order.id}/facture`}
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-lg border border-[#F3DDD8] px-2 py-1 text-xs font-medium text-[#9F2638] hover:bg-[#FAF4EF]"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Voir facture
                  </Link>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      handleUpdateStatus(order.id, e.target.value as Order['status'])
                    }
                    className="rounded-lg border border-[#F3DDD8] bg-white px-2 py-1 text-xs text-[#3B2420] outline-none focus:border-[#9F2638]"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              ),
            },
          ]}
          data={commandes}
          keyExtractor={(order) => order.id}
          emptyMessage="Aucune commande trouvée"
        />
      </Card>
    </div>
  )
}
