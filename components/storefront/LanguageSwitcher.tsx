'use client'

import { useLanguage } from '@/context/LanguageContext'

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="flex rounded-full bg-[#FAF4EF] p-1 text-xs font-bold text-[#3B2420]">
      {(['fr', 'ar'] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLanguage(item)}
          className={`rounded-full px-2.5 py-1 transition-colors ${
            language === item ? 'bg-[#9F2638] text-white' : 'hover:text-[#9F2638]'
          }`}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
