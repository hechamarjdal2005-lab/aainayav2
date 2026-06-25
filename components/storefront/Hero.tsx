import { createClient } from '@/lib/supabase/server'
import { Setting } from '@/types'
import { HeroContent } from './HeroContent'

async function getSettings(): Promise<Partial<Setting> | null> {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('settings').select('*').single()
    return data as Partial<Setting> | null
  } catch {
    return null
  }
}

export async function Hero() {
  const settings = await getSettings()
  const videoUrl = settings?.hero_video_url

  return (
    <section
      id="top"
      className="relative min-h-[85vh] overflow-hidden bg-[#3B2420] md:min-h-screen"
    >
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 z-0 w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#3B2420]/30 via-[#3B2420]/20 to-[#3B2420]/40" />
      <HeroContent settings={settings} />
    </section>
  )
}
