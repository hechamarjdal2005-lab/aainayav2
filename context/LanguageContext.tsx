'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type Language = 'fr' | 'ar'

type LanguageContextValue = {
  language: Language
  setLanguage: (language: Language) => void
  isArabic: boolean
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr')

  useEffect(() => {
    const stored = window.localStorage.getItem('3inaya_language')
    if (stored === 'ar' || stored === 'fr') setLanguageState(stored)
  }, [])

  const setLanguage = (next: Language) => {
    setLanguageState(next)
    window.localStorage.setItem('3inaya_language', next)
  }

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
  }, [language])

  const value = useMemo(
    () => ({ language, setLanguage, isArabic: language === 'ar' }),
    [language]
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

export function localized(
  language: Language,
  fr?: string | null,
  ar?: string | null
) {
  return language === 'ar' ? ar || fr || '' : fr || ar || ''
}
