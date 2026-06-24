export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatPrix(prix: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
  }).format(prix)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getStatutColor(statut: string): string {
  const colors: Record<string, string> = {
    en_attente: 'bg-amber-100 text-amber-800',
    confirmee: 'bg-blue-100 text-blue-800',
    expediee: 'bg-purple-100 text-purple-800',
    livree: 'bg-green-100 text-green-800',
    annulee: 'bg-red-100 text-red-800',
  }
  return colors[statut] || 'bg-gray-100 text-gray-800'
}

export function getStatutLabel(statut: string): string {
  const labels: Record<string, string> = {
    en_attente: 'En attente',
    confirmee: 'Confirmée',
    expediee: 'Expédiée',
    livree: 'Livrée',
    annulee: 'Annulée',
  }
  return labels[statut] || statut
}

export const STATUTS = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'expediee', label: 'Expédiée' },
  { value: 'livree', label: 'Livrée' },
  { value: 'annulee', label: 'Annulée' },
] as const
