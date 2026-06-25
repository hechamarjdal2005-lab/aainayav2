import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { Award, Leaf, ShieldCheck, Sparkles } from 'lucide-react'

type CertificationRow = {
  id: string
  name?: string | null
  nom?: string | null
  logo_url?: string | null
  description?: string | null
}

const fallbackBadges: CertificationRow[] = [
  { id: 'natural', name: 'Naturel', description: 'Ingrédients sélectionnés' },
  { id: 'artisan', name: 'Artisanal', description: 'Rituels marocains' },
  { id: 'quality', name: 'Qualité', description: 'Lots contrôlés' },
  { id: 'care', name: 'Soins', description: 'Formules délicates' },
]

const icons = [Leaf, Sparkles, ShieldCheck, Award]

async function getCertifications() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    return (data || []) as CertificationRow[]
  } catch {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('certifications')
        .select('*')
        .eq('is_active', true)
        .order('ordre', { ascending: true })

      return (data || []) as CertificationRow[]
    } catch {
      return []
    }
  }
}

export async function CertificationBanner() {
  const certifications = await getCertifications()
  const rows = certifications.length > 0 ? certifications : fallbackBadges

  return (
    <section className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:overflow-visible">
          {rows.map((certification, index) => {
            const Icon = icons[index % icons.length]
            const label = certification.name || certification.nom || 'Certification'

            return (
              <div
                key={certification.id}
                className="flex min-w-[220px] items-center gap-3 rounded-xl border border-[#eadbd6] bg-[#FAF7F4] px-4 py-3"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-primary">
                  {certification.logo_url ? (
                    <Image
                      src={certification.logo_url}
                      alt={label}
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-black text-on-surface">
                    {label}
                  </p>
                  {certification.description && (
                    <p className="truncate text-xs text-on-surface-variant">
                      {certification.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
