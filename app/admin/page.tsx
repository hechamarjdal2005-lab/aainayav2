import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/StatsCard'
import { Badge } from '@/components/ui/Badge'
import { formatPrix, formatDate, getStatutColor, getStatutLabel } from '@/lib/utils'
import { ShoppingCart, Wallet, Package, Users } from 'lucide-react'
import { DashboardCharts } from './DashboardCharts'

async function getStats() {
  const supabase = createClient()

  const { count: commandesCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const { data: caData } = await supabase
    .from('orders')
    .select('total')
    .neq('status', 'cancelled')

  const caTotal = caData?.reduce((sum, c) => sum + Number(c.total), 0) || 0

  const { count: produitsCount } = await supabase
    .from('produits')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: clientsCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'client')

  const { data: recentCommandes } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentRevenus } = await supabase
    .from('orders')
    .select('total, created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .neq('status', 'cancelled')
    .order('created_at')

  const { data: orderedItems } = await supabase
    .from('order_items')
    .select('quantity, item_type')

  const categoryMap: Record<string, number> = {}
  type OrderedItem = {
    quantity?: number | null
    item_type?: string | null
  }

  const orderRows = (orderedItems || []) as unknown as OrderedItem[]
  orderRows.forEach((item) => {
    const name = item.item_type === 'pack' ? 'Packs' : 'Produits'
    categoryMap[name] = (categoryMap[name] || 0) + Number(item.quantity || 1)
  })

  return {
    commandesCount: commandesCount || 0,
    caTotal,
    produitsCount: produitsCount || 0,
    clientsCount: clientsCount || 0,
    recentCommandes: recentCommandes || [],
    recentRevenus: recentRevenus || [],
    categoryOrders: Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    })),
  }
}

export default async function AdminDashboard() {
  const data = await getStats()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Commandes"
          value={data.commandesCount}
          icon={ShoppingCart}
          change={12}
        />
        <StatsCard
          title="Chiffre d'affaires"
          value={formatPrix(data.caTotal)}
          icon={Wallet}
          change={8}
        />
        <StatsCard
          title="Produits actifs"
          value={data.produitsCount}
          icon={Package}
          change={4}
        />
        <StatsCard
          title="Clients"
          value={data.clientsCount}
          icon={Users}
          change={6}
        />
      </div>

      <DashboardCharts
        recentRevenus={data.recentRevenus}
        categoryOrders={data.categoryOrders}
      />

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-heading text-lg font-black text-gray-900">
          Dernières commandes
        </h3>
        <div className="space-y-3">
          {data.recentCommandes.map((cmd) => (
            <div
              key={cmd.id}
              className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {cmd.client_name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(cmd.created_at)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{formatPrix(cmd.total)}</p>
                <Badge className={getStatutColor(cmd.status)}>
                  {getStatutLabel(cmd.status)}
                </Badge>
              </div>
            </div>
          ))}
          {data.recentCommandes.length === 0 && (
            <p className="py-4 text-center text-sm text-gray-500">
              Aucune commande récente
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
