import { createClient } from '@/lib/supabase/server'
import { StatsCard } from '@/components/admin/StatsCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatPrix, formatDate, getStatutColor, getStatutLabel } from '@/lib/utils'
import {
  ShoppingCart,
  Wallet,
  Package,
  Gift,
  Award,
} from 'lucide-react'
import { DashboardCharts } from './DashboardCharts'

async function getStats() {
  const supabase = createClient()

  const { count: commandesCount } = await supabase
    .from('commandes')
    .select('*', { count: 'exact', head: true })

  const { data: caData } = await supabase
    .from('commandes')
    .select('total')
    .neq('statut', 'annulee')

  const caTotal = caData?.reduce((sum, c) => sum + Number(c.total), 0) || 0

  const { count: produitsCount } = await supabase
    .from('produits')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: packsCount } = await supabase
    .from('packs')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: certifsCount } = await supabase
    .from('certifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { data: recentCommandes } = await supabase
    .from('commandes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: statsData } = await supabase
    .from('commandes')
    .select('statut')

  const stats = {
    en_attente: 0,
    confirmee: 0,
    expediee: 0,
    livree: 0,
    annulee: 0,
  }
  statsData?.forEach((c) => {
    if (c.statut in stats) {
      stats[c.statut as keyof typeof stats]++
    }
  })

  // Last 7 days revenue
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentRevenus } = await supabase
    .from('commandes')
    .select('total, created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .neq('statut', 'annulee')
    .order('created_at')

  return {
    commandesCount: commandesCount || 0,
    caTotal,
    produitsCount: produitsCount || 0,
    packsCount: packsCount || 0,
    certifsCount: certifsCount || 0,
    recentCommandes: recentCommandes || [],
    stats,
    recentRevenus: recentRevenus || [],
  }
}

export default async function AdminDashboard() {
  const data = await getStats()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatsCard
          title="Commandes"
          value={data.commandesCount}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Chiffre d'affaires"
          value={formatPrix(data.caTotal)}
          icon={Wallet}
        />
        <StatsCard
          title="Produits actifs"
          value={data.produitsCount}
          icon={Package}
        />
        <StatsCard
          title="Packs actifs"
          value={data.packsCount}
          icon={Gift}
        />
        <StatsCard
          title="Certifications"
          value={data.certifsCount}
          icon={Award}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-serif text-lg font-semibold mb-4">
            Dernières commandes
          </h3>
          <div className="space-y-3">
            {data.recentCommandes.map((cmd) => (
              <div
                key={cmd.id}
                className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    {cmd.nom_client}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {formatDate(cmd.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {formatPrix(cmd.total)}
                  </p>
                  <Badge className={getStatutColor(cmd.statut)}>
                    {getStatutLabel(cmd.statut)}
                  </Badge>
                </div>
              </div>
            ))}
            {data.recentCommandes.length === 0 && (
              <p className="text-sm text-on-surface-variant text-center py-4">
                Aucune commande récente
              </p>
            )}
          </div>
        </Card>

        <DashboardCharts
          stats={data.stats}
          recentRevenus={data.recentRevenus}
        />
      </div>
    </div>
  )
}
