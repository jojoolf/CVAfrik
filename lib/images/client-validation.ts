export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export const ACCEPTED_IMAGE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(',')

export type SupportedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number]

const extensionByMimeType: Record<SupportedImageType, 'jpg' | 'png' | 'webp'> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function validateImageFile(file: File, maxBytes: number): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as SupportedImageType)) {
    return 'Choisissez une image JPG, PNG ou WEBP.'
  }

  if (file.size > maxBytes) {
    return `L’image ne doit pas dépasser ${Math.round(maxBytes / (1024 * 1024))} Mo.`
  }

  return null
}

export function imageExtensionFromMimeType(mimeType: string): 'jpg' | 'png' | 'webp' {
  return extensionByMimeType[mimeType as SupportedImageType] || 'jpg'
}
