import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseProfileText } from '@/lib/linkedin-import'

export const runtime = 'nodejs'

const MAX_PDF_BYTES = 8 * 1024 * 1024
const MAX_PDF_PAGES = 8
const MAX_PDF_TEXT_LENGTH = 60_000

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Connecte-toi pour importer un PDF.' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'Choisis un fichier PDF.' }, { status: 400 })
    if (file.size === 0) return NextResponse.json({ error: 'Ce fichier PDF est vide.' }, { status: 400 })
    if (file.size > MAX_PDF_BYTES) return NextResponse.json({ error: 'Ce PDF est trop lourd. Utilise un fichier de 8 Mo maximum, idéalement sans scan ni images.' }, { status: 413 })

    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
    let document: any
    try {
      document = await pdfjs.getDocument({
        data: new Uint8Array(await file.arrayBuffer()),
        disableAutoFetch: true,
        disableStream: true,
        maxImageSize: 1_000_000,
        stopAtErrors: false,
      }).promise

      const pages: string[] = []
      let extractedLength = 0
      for (let pageNumber = 1; pageNumber <= Math.min(document.numPages, MAX_PDF_PAGES) && extractedLength < MAX_PDF_TEXT_LENGTH; pageNumber += 1) {
        const page = await document.getPage(pageNumber)
        const text = await page.getTextContent({ includeMarkedContent: false })
        const pageText = text.items.map((item: any) => item.str || '').join(' ').trim()
        if (pageText) {
          pages.push(pageText.slice(0, MAX_PDF_TEXT_LENGTH - extractedLength))
          extractedLength += pageText.length
        }
        page.cleanup()
      }

      if (!pages.length) return NextResponse.json({ error: 'Ce PDF ne contient pas de texte sélectionnable. Essaie un PDF texte, ou utilise « Coller mon profil ».' }, { status: 422 })
      return NextResponse.json(parseProfileText(pages.join('\n')))
    } finally {
      await document?.destroy()
    }
  } catch (error) {
    console.error('PDF profile import failed', error)
    return NextResponse.json({ error: 'Impossible de lire ce PDF. Essaie un PDF texte plus léger ou colle le contenu de ton CV.' }, { status: 422 })
  }
}
