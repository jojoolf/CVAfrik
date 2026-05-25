'use client'

import { useMemo, useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Copy, Download, Eye, Loader2, PencilLine, Save } from 'lucide-react'
import { toast } from 'sonner'
import { updateLettreContent } from '../actions'

interface LettreContentEditorProps {
  initialContent: string
  id: string
  title: string
}

function splitParagraphs(content: string) {
  return content
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
}

function formatFilename(title: string) {
  const cleaned = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')

  return cleaned || 'lettre_motivation'
}

export function LettreContentEditor({ initialContent, id, title }: LettreContentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [lastSavedContent, setLastSavedContent] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [copying, setCopying] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(true)
  const pdfRef = useRef<HTMLDivElement | null>(null)

  const hasChanges = content !== lastSavedContent
  const paragraphs = useMemo(() => splitParagraphs(content), [content])

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await updateLettreContent(id, content)
      if (result.success) {
        setLastSavedContent(content)
        toast.success('Modifications enregistrees !')
      } else {
        toast.error(result.error || "Erreur lors de l'enregistrement.")
      }
    } catch (error) {
      console.error(error)
      toast.error('Une erreur est survenue.')
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = async () => {
    if (!content.trim()) {
      toast.error('La lettre est vide.')
      return
    }

    setCopying(true)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content)
      } else {
        const helper = document.createElement('textarea')
        helper.value = content
        helper.style.position = 'fixed'
        helper.style.left = '-9999px'
        document.body.appendChild(helper)
        helper.focus()
        helper.select()
        document.execCommand('copy')
        helper.remove()
      }

      toast.success('Lettre copiee dans le presse-papiers.')
    } catch (error) {
      console.error(error)
      toast.error('Impossible de copier la lettre.')
    } finally {
      setCopying(false)
    }
  }

  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return
    if (!content.trim()) {
      toast.error('La lettre est vide.')
      return
    }

    setExportingPdf(true)
    try {
      const [{ default: html2canvas }, jspdfModule] = await Promise.all([import('html2canvas'), import('jspdf')])
      const JsPdfCtor =
        typeof jspdfModule.jsPDF === 'function' ? jspdfModule.jsPDF : (jspdfModule as any).default

      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new JsPdfCtor({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imageHeight = (canvas.height * pageWidth) / canvas.width

      let renderedHeight = imageHeight
      let position = 0
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imageHeight)

      while (renderedHeight > pageHeight) {
        position = renderedHeight - imageHeight
        renderedHeight -= pageHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imageHeight)
      }

      pdf.save(`${formatFilename(title)}.pdf`)
      toast.success('PDF telecharge avec succes !')
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la generation du PDF.')
    } finally {
      setExportingPdf(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/20 p-3">
        <div className="text-sm text-muted-foreground">
          {hasChanges ? 'Modifications non enregistrees' : 'Tout est enregistre'}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setIsPreviewMode((prev) => !prev)}>
            {isPreviewMode ? (
              <>
                <PencilLine className="mr-2 h-4 w-4" />
                Mode edition
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Mode lecture
              </>
            )}
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={handleCopy} disabled={copying}>
            {copying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Copy className="mr-2 h-4 w-4" />}
            Copier
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={handleDownloadPdf} disabled={exportingPdf}>
            {exportingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Telecharger PDF
          </Button>

          <Button type="button" size="sm" onClick={handleSave} disabled={saving || !hasChanges} className="bg-primary">
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer
          </Button>
        </div>
      </div>

      {isPreviewMode ? (
        <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-10">
          <article className="mx-auto max-w-3xl text-[15px] leading-7 text-slate-900 [font-family:Georgia,'Times_New_Roman',serif]">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 20)}`} className="mb-5 whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">Commencez a rediger votre lettre...</p>
            )}
          </article>
        </div>
      ) : (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[500px] resize-none leading-relaxed text-base"
          placeholder="Le contenu de votre lettre..."
        />
      )}

      <div className="pointer-events-none fixed left-[-9999px] top-0 w-[794px]">
        <div ref={pdfRef} className="min-h-[1123px] bg-white px-16 py-20 text-[14px] leading-7 text-black [font-family:Georgia,'Times_New_Roman',serif]">
          {paragraphs.length > 0 ? (
            paragraphs.map((paragraph, index) => (
              <p key={`pdf-${index}-${paragraph.slice(0, 20)}`} className="mb-5 whitespace-pre-wrap">
                {paragraph}
              </p>
            ))
          ) : (
            <p>Lettre vide</p>
          )}
        </div>
      </div>
    </div>
  )
}
