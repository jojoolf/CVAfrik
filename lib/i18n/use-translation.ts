'use client'

import { useCallback, useEffect, useState } from 'react'
import { getTranslation, defaultLocale, type Locale } from './index'

const COOKIE_NAME = 'locale'

export function useTranslation() {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${COOKIE_NAME}=`))
    const val = cookie?.split('=')[1] as Locale | undefined
    if (val && ['fr', 'en', 'pt'].includes(val)) {
      setLocaleState(val)
    }
  }, [])

  const t = useCallback((path: string): string => {
    return getTranslation(locale, path)
  }, [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    document.cookie = `${COOKIE_NAME}=${newLocale};path=/;max-age=31536000`
    window.location.reload()
  }, [])

  return { locale, setLocale, t }
}
