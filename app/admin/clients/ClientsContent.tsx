'use client'

import { useState } from 'react'
import { Profile } from '@/types'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table } from '@/components/ui/Table'
import { formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ClientsContentProps {
  clients: Profile[]
}

export function ClientsContent({ clients: initial }: ClientsContentProps) {
  const [clients, setClients] = useState(initial)
  const router = useRouter()
  const supabase = createClient()

  const toggleRole = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'client' : 'admin'
    await supabase.from('profiles').update({ role: newRole }).eq('id', id)
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, role: newRole as Profile['role'] } : c))
    )
    router.refresh()
  }

  return (
    <Card>
      <Table
        columns={[
          { header: 'Nom', accessor: (c: Profile) => c.full_name || '-' },
          { header: 'Email', accessor: (c: Profile) => c.email || '-' },
          {
            header: 'Téléphone',
            accessor: (c: Profile) => c.phone || '-',
          },
          {
            header: 'Rôle',
            accessor: (c: Profile) => (
              <Badge
                className={
                  c.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }
              >
                {c.role === 'admin' ? 'Admin' : 'Client'}
              </Badge>
            ),
          },
          {
            header: 'Inscrit le',
            accessor: (c: Profile) => formatDate(c.created_at),
          },
          {
            header: 'Actions',
            accessor: (c: Profile) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleRole(c.id, c.role)}
              >
                {c.role === 'admin' ? 'Rétrograder' : 'Promouvoir admin'}
              </Button>
            ),
          },
        ]}
        data={clients}
        keyExtractor={(c) => c.id}
        emptyMessage="Aucun client"
      />
    </Card>
  )
}
