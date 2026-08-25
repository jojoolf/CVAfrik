'use client'

import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const A4_WIDTH_PX = 794
const A4_PAGE_HEIGHT_MM = 297
const A4_PAGE_WIDTH_MM = 210

function safeFilename(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9À-ÿ _-]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 80) || 'CV_CVAfrik'
}

/**
 * Renders the actual CV DOM node to a paginated A4 PDF.
 * The node must remain rendered in the document; the clone used by html2canvas
 * is moved into a visible rendering context before the capture starts.
 */
export async function downloadCvPdf(renderNode: HTMLElement, filename: string) {
  await document.fonts?.ready

  const renderHeight = Math.max(renderNode.scrollHeight, renderNode.offsetHeight, 1123)
  const canvas = await html2canvas(renderNode, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
    width: A4_WIDTH_PX,
    height: renderHeight,
    windowWidth: A4_WIDTH_PX,
    windowHeight: renderHeight,
    scrollX: 0,
    scrollY: 0,
    onclone: (clonedDocument) => {
      const clonedNode = clonedDocument.querySelector<HTMLElement>('[data-cv-pdf-render="true"]')
      if (!clonedNode) return
      clonedNode.style.position = 'static'
      clonedNode.style.left = '0'
      clonedNode.style.top = '0'
      clonedNode.style.zIndex = '1'
      clonedNode.style.visibility = 'visible'
      clonedNode.style.display = 'block'
      clonedNode.style.overflow = 'visible'
      clonedNode.style.background = '#ffffff'
      clonedDocument.body.style.background = '#ffffff'
    },
  })

  if (canvas.width < 20 || canvas.height < 20) {
    throw new Error('Le rendu du CV est vide. Réessaie dans quelques secondes.')
  }

  const imageData = canvas.toDataURL('image/png', 1)
  const imageHeightMm = (canvas.height * A4_PAGE_WIDTH_MM) / canvas.width
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })

  let remainingHeight = imageHeightMm
  let offsetY = 0
  while (remainingHeight > 0) {
    pdf.addImage(imageData, 'PNG', 0, offsetY, A4_PAGE_WIDTH_MM, imageHeightMm, undefined, 'FAST')
    remainingHeight -= A4_PAGE_HEIGHT_MM
    if (remainingHeight > 0) {
      pdf.addPage()
      offsetY -= A4_PAGE_HEIGHT_MM
    }
  }

  pdf.save(`${safeFilename(filename)}.pdf`)
}
