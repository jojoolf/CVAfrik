'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { getTranslation, defaultLocale, type Locale } from './index'

const COOKIE_NAME = 'locale'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (path: string) => string
}

const LocaleContext = createContext<LocaleContextType | null>(null)

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale
  try {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${COOKIE_NAME}=`))
    const val = cookie?.split('=')[1] as Locale | undefined
    if (val && ['fr', 'en', 'pt'].includes(val)) return val
  } catch {}
  return defaultLocale
}

export function LocaleProvider({
  children,
  serverLocale,
}: {
  children: React.ReactNode
  serverLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(serverLocale || getInitialLocale)

  useEffect(() => {
    const cookieLocale = getInitialLocale()
    if (cookieLocale !== locale) {
      setLocaleState(cookieLocale)
    }
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=31536000`
  }, [])

  const t = useCallback((path: string): string => {
    return getTranslation(locale, path)
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
