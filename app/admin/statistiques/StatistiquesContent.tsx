'use client'

import { Card } from '@/components/ui/Card'
import { formatPrix } from '@/lib/utils'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#855050', '#954647', '#d6c2c1', '#6a3939', '#524343']

interface StatistiquesContentProps {
  data: {
    revenus: { total: number; created_at: string }[]
    topProduits: { produits: { nom: string } | null; quantite: number; prix_unitaire: number }[]
    categoriesData: { categories: { nom: string } | null }[]
    cities: { ville: string | null; total: number }[]
  }
}

export function StatistiquesContent({ data }: StatistiquesContentProps) {
  // Aggregate revenus by month
  const revenusByMonth: Record<string, number> = {}
  data.revenus.forEach((r) => {
    const month = new Date(r.created_at).toLocaleDateString('fr-FR', {
      month: 'short',
      year: '2-digit',
    })
    revenusByMonth[month] = (revenusByMonth[month] || 0) + Number(r.total)
  })

  const revenuChartData = Object.entries(revenusByMonth).map(
    ([month, revenu]) => ({ month, revenu })
  )

  // Aggregate top products
  const productMap: Record<string, number> = {}
  data.topProduits.forEach((item) => {
    const name = item.produits?.nom || 'Inconnu'
    productMap[name] = (productMap[name] || 0) + item.quantite
  })

  const topProductsData = Object.entries(productMap)
    .map(([name, quantite]) => ({ name, quantite }))
    .sort((a, b) => b.quantite - a.quantite)
    .slice(0, 10)

  // Aggregate categories
  const catMap: Record<string, number> = {}
  data.categoriesData.forEach((item) => {
    const name = item.categories?.nom || 'Non catégorisé'
    catMap[name] = (catMap[name] || 0) + 1
  })

  const catChartData = Object.entries(catMap).map(([name, count], i) => ({
    name,
    count,
    color: COLORS[i % COLORS.length],
  }))

  // Aggregate cities
  const cityMap: Record<string, { count: number; total: number }> = {}
  data.cities.forEach((item) => {
    const ville = item.ville || 'Inconnue'
    if (!cityMap[ville]) cityMap[ville] = { count: 0, total: 0 }
    cityMap[ville].count++
    cityMap[ville].total += Number(item.total)
  })

  const cityData = Object.entries(cityMap)
    .map(([ville, data]) => ({ ville, ...data }))
    .sort((a, b) => b.total - a.total)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-serif text-lg font-semibold mb-4">
            Évolution du chiffre d&apos;affaires
          </h3>
          {revenuChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenuChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d6c2c1" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatPrix(Number(value))} />
                <Line
                  type="monotone"
                  dataKey="revenu"
                  stroke="#855050"
                  strokeWidth={2}
                  dot={{ fill: '#855050' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-12 text-on-surface-variant">
              Aucune donnée
            </p>
          )}
        </Card>

        <Card>
          <h3 className="font-serif text-lg font-semibold mb-4">
            Top produits vendus
          </h3>
          {topProductsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProductsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#d6c2c1" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="quantite" fill="#855050" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center py-12 text-on-surface-variant">
              Aucune donnée
            </p>
          )}
        </Card>

        <Card>
          <h3 className="font-serif text-lg font-semibold mb-4">
            Répartition par catégorie
          </h3>
          {catChartData.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={catChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label
                  >
                    {catChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {catChartData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-on-surface-variant">{entry.name}</span>
                    <span className="font-semibold">{entry.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center py-12 text-on-surface-variant">
              Aucune donnée
            </p>
          )}
        </Card>

        <Card>
          <h3 className="font-serif text-lg font-semibold mb-4">
            Commandes par ville
          </h3>
          {cityData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-outline-variant/30">
                    <th className="text-left py-2 px-3 font-medium text-on-surface-variant">
                      Ville
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-on-surface-variant">
                      Commandes
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-on-surface-variant">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cityData.map((item) => (
                    <tr
                      key={item.ville}
                      className="border-b border-outline-variant/10"
                    >
                      <td className="py-2 px-3 font-medium">{item.ville}</td>
                      <td className="py-2 px-3 text-right">{item.count}</td>
                      <td className="py-2 px-3 text-right font-semibold">
                        {formatPrix(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-12 text-on-surface-variant">
              Aucune donnée
            </p>
          )}
        </Card>
      </div>
    </div>
  )
}
