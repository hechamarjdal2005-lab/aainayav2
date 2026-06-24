import { createClient } from '@/lib/supabase/server'
import { Setting } from '@/types'
import Link from 'next/link'
import { Sparkles, Camera, Globe, Video, Music2, BookImage } from 'lucide-react'

async function getSettings(): Promise<Setting | null> {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('settings').select('*').single()
    return data as Setting | null
  } catch {
    return null
  }
}

const socialIcons: {
  key: keyof Setting
  icon: React.ReactNode
  label: string
}[] = [
  { key: 'instagram_url', icon: <Camera className="h-5 w-5" />, label: 'Instagram' },
  { key: 'facebook_url', icon: <Globe className="h-5 w-5" />, label: 'Facebook' },
  { key: 'tiktok_url', icon: <Music2 className="h-5 w-5" />, label: 'TikTok' },
  { key: 'youtube_url', icon: <Video className="h-5 w-5" />, label: 'YouTube' },
  { key: 'pinterest_url', icon: <BookImage className="h-5 w-5" />, label: 'Pinterest' },
]

export async function Footer() {
  const settings = await getSettings()

  const siteName = settings?.site_name || '3INAYA'
  const footerDescription =
    settings?.footer_description ||
    "L'art du rituel de beauté marocain. Produits naturels artisanaux issus du terroir marocain."
  const copyright =
    settings?.footer_copyright ||
    `© ${new Date().getFullYear()} 3INAYA. Tous droits réservés.`
  const contactEmail = settings?.contact_email || 'contact@3inaya.ma'
  const contactPhone = settings?.contact_phone || ''
  const whatsapp = settings?.whatsapp || ''

  const socialLinks = socialIcons
    .map((s) => ({
      url: settings?.[s.key] as string | null,
      icon: s.icon,
      label: s.label,
    }))
    .filter((s) => s.url)

  return (
    <footer className="bg-primary-dark text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <span className="font-serif text-xl font-bold">{siteName}</span>
            </div>
            <p className="text-sm text-white/70 max-w-md">{footerDescription}</p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white transition-colors"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Liens rapides</h4>
            <div className="space-y-2 text-sm text-white/70">
              <Link href="/shop" className="block hover:text-white">
                Boutique
              </Link>
              <Link
                href="/shop?category=visage"
                className="block hover:text-white"
              >
                Soins visage
              </Link>
              <Link
                href="/shop?category=corps"
                className="block hover:text-white"
              >
                Soins corps
              </Link>
              <Link
                href="/shop?category=cheveux"
                className="block hover:text-white"
              >
                Soins cheveux
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-white/70">
              {contactEmail && <p>{contactEmail}</p>}
              {contactPhone && <p>{contactPhone}</p>}
              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:text-white"
                >
                  WhatsApp
                </a>
              )}
              <p>Maroc</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/50">
          {copyright}
        </div>
      </div>
    </footer>
  )
}
