import { cookies } from 'next/headers'
import { getTranslation, isValidLocale, defaultLocale, type Locale } from './index'

export async function createTranslator() {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('locale')?.value
  const locale: Locale = localeCookie && isValidLocale(localeCookie) ? localeCookie : defaultLocale

  return {
    locale,
    t: (path: string): string => getTranslation(locale, path),
  }
}
