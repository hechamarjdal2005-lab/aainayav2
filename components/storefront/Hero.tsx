import { createClient } from '@/lib/supabase/server'
import { Setting } from '@/types'
import Link from 'next/link'

async function getSettings(): Promise<Pick<Setting, 'hero_video_url'> | null> {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('settings')
      .select('hero_video_url')
      .single()
    return data as Pick<Setting, 'hero_video_url'> | null
  } catch {
    return null
  }
}

export async function Hero() {
  const settings = await getSettings()
  const videoUrl = settings?.hero_video_url

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-surface via-surface to-surface">
      {videoUrl ? (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40 z-[1]" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-5 z-0" />
      )}

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-primary mb-2">
          عناية
        </h1>
        <p className="text-2xl md:text-3xl font-serif text-primary-dark mb-4">
          3INAYA
        </p>
        <p className="text-lg md:text-xl text-on-surface-variant mb-8 font-light">
          L&apos;art du rituel de beauté marocain — Huile d&apos;argan, Ghassoul,
          Eau de rose &amp; Savon beldi
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Découvrir nos produits
          </Link>
          <Link
            href="/shop?category=packs"
            className="inline-flex items-center justify-center h-12 px-8 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition-colors"
          >
            Voir les coffrets
          </Link>
        </div>
      </div>
    </section>
  )
}
