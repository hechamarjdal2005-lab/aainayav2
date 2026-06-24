import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  className?: string
}

export function StatsCard({ title, value, icon: Icon, className }: StatsCardProps) {
  return (
    <Card className={cn('flex items-center gap-4', className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-on-surface-variant">{title}</p>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
      </div>
    </Card>
  )
}
