'use client'

import { formatPrix } from '@/lib/utils'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const COLORS = ['#8B2635', '#C4956A', '#2C1810', '#10b981', '#6366f1', '#f59e0b']

interface DashboardChartsProps {
  recentRevenus: { total: number; created_at: string }[]
  categoryOrders: { name: string; value: number }[]
}

export function DashboardCharts({
  recentRevenus,
  categoryOrders,
}: DashboardChartsProps) {
  const revenusByDay: Record<string, number> = {}
  recentRevenus.forEach((r) => {
    const day = new Date(r.created_at).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
    })
    revenusByDay[day] = (revenusByDay[day] || 0) + Number(r.total)
  })

  const lineData = Object.entries(revenusByDay).map(([date, revenu]) => ({
    date,
    revenu,
  }))

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-heading text-lg font-black text-gray-900">
          Chiffre d&apos;affaires
        </h3>
        {lineData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1e6e2" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => formatPrix(Number(value))} />
              <Line
                type="monotone"
                dataKey="revenu"
                stroke="#8B2635"
                strokeWidth={3}
                dot={{ r: 4, fill: '#8B2635' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-20 text-center text-sm text-gray-500">
            Aucune donnée cette semaine
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-heading text-lg font-black text-gray-900">
          Commandes par catégorie
        </h3>
        {categoryOrders.length > 0 ? (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="58%" height={280}>
              <PieChart>
                <Pie
                  data={categoryOrders}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={96}
                  dataKey="value"
                >
                  {categoryOrders.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {categoryOrders.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600">{entry.name}</span>
                  <span className="font-semibold text-gray-900">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="py-20 text-center text-sm text-gray-500">
            Aucune donnée
          </p>
        )}
      </div>
    </div>
  )
}
