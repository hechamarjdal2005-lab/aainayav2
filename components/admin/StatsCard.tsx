import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  change?: number
  className?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  change = 0,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-white p-6 shadow-sm',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B2635]/10">
          <Icon className="h-5 w-5 text-[#8B2635]" />
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-green-600">+{change}% ce mois</div>
    </div>
  )
}
