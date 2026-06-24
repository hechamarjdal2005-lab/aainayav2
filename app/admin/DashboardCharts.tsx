'use client'

import { Card } from '@/components/ui/Card'
import { formatPrix } from '@/lib/utils'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const COLORS = {
  en_attente: '#f59e0b',
  confirmee: '#3b82f6',
  expediee: '#8b5cf6',
  livree: '#10b981',
  annulee: '#ef4444',
}

const STATUT_LABELS: Record<string, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  expediee: 'Expédiée',
  livree: 'Livrée',
  annulee: 'Annulée',
}

interface DashboardChartsProps {
  stats: Record<string, number>
  recentRevenus: { total: number; created_at: string }[]
}

export function DashboardCharts({ stats, recentRevenus }: DashboardChartsProps) {
  const pieData = Object.entries(stats)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: STATUT_LABELS[key] || key,
      value,
      color: COLORS[key as keyof typeof COLORS] || '#6b7280',
    }))

  // Aggregate revenus by day
  const revenusByDay: Record<string, number> = {}
  recentRevenus.forEach((r) => {
    const day = new Date(r.created_at).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
    })
    revenusByDay[day] = (revenusByDay[day] || 0) + Number(r.total)
  })

  const barData = Object.entries(revenusByDay).map(([date, revenu]) => ({
    date,
    revenu,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-serif text-lg font-semibold mb-4">
          Statuts des commandes
        </h3>
        {pieData.length > 0 ? (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-on-surface-variant">{entry.name}</span>
                  <span className="font-semibold text-on-surface">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-on-surface-variant text-center py-8">
            Aucune donnée
          </p>
        )}
      </Card>

      <Card>
        <h3 className="font-serif text-lg font-semibold mb-4">
          Revenus (7 jours)
        </h3>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d6c2c1" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => formatPrix(Number(value))}
              />
              <Bar dataKey="revenu" fill="#855050" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-on-surface-variant text-center py-8">
            Aucune donnée cette semaine
          </p>
        )}
      </Card>
    </div>
  )
}
