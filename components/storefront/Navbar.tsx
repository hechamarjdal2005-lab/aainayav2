import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { NavbarMobile } from './NavbarMobile'

export async function Navbar() {
  noStore()

  const supabase = createClient()
  const { data: settings } = await supabase
    .from('settings')
    .select('logo_url')
    .eq('id', 1)
    .single()

  const logoUrl = settings?.logo_url || null

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 min-w-0 w-[calc(100%-40px)] max-w-[400px] md:min-w-[480px] md:w-fit md:max-w-[700px]">
      <div className="flex items-center justify-between w-full bg-white rounded-full shadow-lg border border-[#d6c2c1] px-6 py-[10px]">
        <div className="w-11 flex items-center justify-start">
          <Link
            href="/"
            className="h-11 w-11 rounded-full bg-[#855050] flex items-center justify-center overflow-hidden flex-shrink-0"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt=""
                width={44}
                height={44}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <span className="font-serif text-white text-lg font-bold">3</span>
            )}
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="font-sans text-[15px] text-[#271718] hover:text-[#855050] transition-colors duration-300"
          >
            Accueil
          </Link>
          <Link
            href="/shop"
            className="font-sans text-[15px] text-[#271718] hover:text-[#855050] transition-colors duration-300"
          >
            Boutique
          </Link>
        </div>

        <div className="w-11 flex items-center justify-end">
          <div className="md:hidden">
            <NavbarMobile />
          </div>
        </div>
      </div>
    </div>
  )
}
