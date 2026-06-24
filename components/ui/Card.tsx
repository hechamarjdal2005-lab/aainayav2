import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-xl bg-surface-card border border-outline-variant/30 p-6', className)}>
      {children}
    </div>
  )
}
