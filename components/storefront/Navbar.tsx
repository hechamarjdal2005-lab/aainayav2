import { unstable_noStore as noStore } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { NavbarMobile } from './NavbarMobile'
import { NavbarCartButton } from './NavbarCartButton'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NavbarLinks } from './NavbarLinks'

export async function Navbar() {
  noStore()

  const supabase = createClient()
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single()

  const logoUrl = settings?.logo_url || null

  return (
    <div className="fixed left-1/2 top-5 z-50 w-[calc(100%-40px)] max-w-[430px] min-w-0 -translate-x-1/2 md:w-fit md:min-w-[640px] md:max-w-[860px]">
      <div className="flex w-full items-center justify-between rounded-full border border-white/50 bg-white/85 px-5 py-[10px] shadow-lg backdrop-blur">
        <div className="flex w-11 items-center justify-start">
          <Link
            href="/#top"
            className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#9F2638]"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={settings?.site_name || ''}
                width={44}
                height={44}
                className="h-full w-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-lg font-bold text-white">{settings?.site_name?.[0] || ''}</span>
            )}
          </Link>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <NavbarLinks settings={settings} />
        </div>

        <div className="flex min-w-[44px] items-center justify-end">
          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            <NavbarCartButton />
          </div>
          <div className="md:hidden">
            <NavbarMobile settings={settings} />
          </div>
        </div>
      </div>
    </div>
  )
}
