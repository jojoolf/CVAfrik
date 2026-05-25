'use client'

import { useLocale } from './locale-provider'

export function useTranslation() {
  return useLocale()
}
