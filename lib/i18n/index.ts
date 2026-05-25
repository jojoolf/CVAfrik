import common from './locales/common.json'

export type Locale = 'fr' | 'en' | 'pt'
export type TranslationKey = string

const translations = common as Record<Locale, Record<string, Record<string, string>>>

const COOKIE_NAME = 'locale'

export const defaultLocale: Locale = 'fr'
export const supportedLocales: Locale[] = ['fr', 'en', 'pt']

export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale)
}

export function getTranslation(locale: Locale, path: string): string {
  const keys = path.split('.')
  let result: any = translations[locale]

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key]
    } else {
      // Fallback to FR
      let fallback: any = translations['fr']
      for (const k of keys) {
        if (fallback && typeof fallback === 'object' && k in fallback) {
          fallback = fallback[k]
        } else {
          return path
        }
      }
      return typeof fallback === 'string' ? fallback : path
    }
  }

  return typeof result === 'string' ? result : path
}

export async function getServerLocale(cookies: { get: (name: string) => { value: string } | undefined }): Promise<Locale> {
  const cookie = cookies.get(COOKIE_NAME)?.value
  if (cookie && isValidLocale(cookie)) return cookie
  return defaultLocale
}

export function getCookieName(): string {
  return COOKIE_NAME
}
