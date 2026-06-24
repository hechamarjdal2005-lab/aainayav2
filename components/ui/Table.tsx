import { cn } from '@/lib/utils'

interface Column<T> {
  header: string
  accessor: keyof T | ((item: T) => React.ReactNode)
  className?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Aucune donnée',
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-on-surface-variant">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-outline-variant/30">
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  'text-left py-3 px-4 font-medium text-on-surface-variant',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className="border-b border-outline-variant/10 hover:bg-surface-card/50 transition-colors"
            >
              {columns.map((col, i) => (
                <td key={i} className={cn('py-3 px-4', col.className)}>
                  {typeof col.accessor === 'function'
                    ? col.accessor(item)
                    : String(item[col.accessor] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
