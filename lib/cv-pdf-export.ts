'use client'

import { jsPDF } from 'jspdf'
import type { CVDonnees } from '@/lib/types'

type Rgb = readonly [number, number, number]

export type CvPdfOptions = {
  templateId?: string
  templateName?: string
  showWatermark?: boolean
}

const pageWidth = 210
const pageHeight = 297
const margin = 16
const contentWidth = pageWidth - margin * 2
const navy: Rgb = [12, 35, 72]
const muted: Rgb = [89, 99, 112]
const pale: Rgb = [248, 249, 251]

const templateAccents: Record<string, Rgb> = {
  classique: [22, 73, 131],
  moderne: [235, 118, 0],
  minimaliste: [51, 65, 85],
  creatif: [147, 51, 234],
  executive: [15, 118, 110],
  tech: [37, 99, 235],
  premium: [180, 83, 9],
  elegant: [157, 23, 77],
  impact: [220, 38, 38],
  international: [30, 64, 175],
}

function safeFilename(value: string) {
  return value
    .trim()
    .replace(/[^a-zA-Z0-9À-ÿ _-]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 80) || 'CV_CVAfrik'
}

function clean(value?: string | null) {
  return (value || '').trim()
}

function displayDate(start?: string, end?: string, inProgress?: boolean) {
  const beginning = clean(start)
  const ending = inProgress ? 'Aujourd’hui' : clean(end)
  if (beginning && ending) return `${beginning} – ${ending}`
  return beginning || ending
}

function addPageHeader(pdf: jsPDF, accent: Rgb, pageNumber: number) {
  pdf.setFillColor(...accent)
  pdf.rect(0, 0, pageWidth, 8, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(7.5)
  pdf.setTextColor(...muted)
  pdf.text('CVAfrik · Curriculum Vitae', margin, 15)
  pdf.text(String(pageNumber), pageWidth - margin, 15, { align: 'right' })
}

function section(pdf: jsPDF, title: string, y: number, accent: Rgb) {
  pdf.setFillColor(...accent)
  pdf.roundedRect(margin, y, contentWidth, 8.5, 1.8, 1.8, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.setTextColor(255, 255, 255)
  pdf.text(title.toUpperCase(), margin + 4, y + 5.7)
  return y + 14
}

function line(pdf: jsPDF, content: string, x: number, y: number, width: number, size = 9.2, color: Rgb = navy, style: 'normal' | 'bold' = 'normal') {
  const prepared = clean(content)
  if (!prepared) return y
  pdf.setFont('helvetica', style)
  pdf.setFontSize(size)
  pdf.setTextColor(...color)
  const lines = pdf.splitTextToSize(prepared, width) as string[]
  pdf.text(lines, x, y)
  return y + lines.length * (size * 0.42 + 1.1)
}

function bulletLines(pdf: jsPDF, values: string[], y: number, width: number) {
  let cursor = y
  for (const value of values.filter(Boolean)) {
    pdf.setFillColor(...navy)
    pdf.circle(margin + 2, cursor - 1.2, 0.8, 'F')
    cursor = line(pdf, value, margin + 5, cursor, width - 5, 8.7, muted)
    cursor += 1.4
  }
  return cursor
}

export function createCvPdf(data: CVDonnees, options: CvPdfOptions = {}) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })
  const accent = templateAccents[options.templateId || ''] || [235, 118, 0] as Rgb
  const person = data.informations_personnelles || { nom: '', prenom: '', email: '', telephone: '', adresse: '' }
  const fullName = `${clean(person.prenom)} ${clean(person.nom)}`.trim() || 'Votre nom'
  const contact = [clean(person.email), clean(person.telephone), clean(person.adresse), clean(person.linkedin)].filter(Boolean).join('  •  ')
  let page = 1
  let y = 0

  const nextPage = () => {
    pdf.addPage()
    page += 1
    addPageHeader(pdf, accent, page)
    y = 24
  }

  const ensure = (space: number) => {
    if (y + space > pageHeight - 18) nextPage()
  }

  pdf.setFillColor(...accent)
  pdf.rect(0, 0, pageWidth, 53, 'F')
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(25)
  pdf.setTextColor(255, 255, 255)
  pdf.text(fullName, margin, 25)
  pdf.setFontSize(12.5)
  pdf.setFont('helvetica', 'normal')
  pdf.text(clean(data.titre_professionnel) || 'Profil professionnel', margin, 34)
  if (contact) {
    pdf.setFontSize(8.5)
    const contactLines = pdf.splitTextToSize(contact, contentWidth) as string[]
    pdf.text(contactLines, margin, 43)
  }
  y = 64

  if (clean(data.resume)) {
    y = section(pdf, 'Profil', y, accent)
    y = line(pdf, data.resume || '', margin, y, contentWidth, 9.3, navy)
    y += 4
  }

  if (data.experiences?.length) {
    ensure(28)
    y = section(pdf, 'Expériences professionnelles', y, accent)
    for (const experience of data.experiences) {
      ensure(27)
      const role = clean(experience.poste) || 'Poste occupé'
      const organization = [clean(experience.entreprise), [clean(experience.ville), clean(experience.pays)].filter(Boolean).join(', ')].filter(Boolean).join(' · ')
      const period = displayDate(experience.date_debut, experience.date_fin, experience.en_cours)
      y = line(pdf, role, margin, y, contentWidth - 44, 10.1, navy, 'bold')
      if (period) {
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(8.2)
        pdf.setTextColor(...accent)
        pdf.text(period, pageWidth - margin, y - 4.5, { align: 'right' })
      }
      y = line(pdf, organization, margin, y + 0.2, contentWidth, 8.7, muted)
      y = line(pdf, experience.description, margin, y + 0.8, contentWidth, 8.8, navy)
      y = bulletLines(pdf, experience.realisations || [], y + 0.8, contentWidth)
      y += 3
    }
  }

  if (data.formations?.length) {
    ensure(28)
    y = section(pdf, 'Formation', y, accent)
    for (const formation of data.formations) {
      ensure(22)
      const title = clean(formation.diplome) || 'Formation'
      const organization = [clean(formation.etablissement), [clean(formation.ville), clean(formation.pays)].filter(Boolean).join(', ')].filter(Boolean).join(' · ')
      const period = displayDate(formation.date_debut, formation.date_fin, formation.en_cours)
      y = line(pdf, title, margin, y, contentWidth - 44, 10, navy, 'bold')
      if (period) {
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(8.2)
        pdf.setTextColor(...accent)
        pdf.text(period, pageWidth - margin, y - 4.5, { align: 'right' })
      }
      y = line(pdf, organization, margin, y + 0.2, contentWidth, 8.7, muted)
      y = line(pdf, formation.description || '', margin, y + 0.8, contentWidth, 8.8, navy)
      y += 3
    }
  }

  if (data.competences?.length) {
    ensure(24)
    y = section(pdf, 'Compétences', y, accent)
    const skills = data.competences.map((skill) => `${clean(skill.nom)}${clean(skill.niveau) ? ` · ${clean(skill.niveau)}` : ''}`).filter(Boolean)
    y = line(pdf, skills.join('     '), margin, y, contentWidth, 9, navy)
    y += 4
  }

  if (data.langues?.length) {
    ensure(22)
    y = section(pdf, 'Langues', y, accent)
    const languages = data.langues.map((language) => `${clean(language.nom)}${clean(language.niveau) ? ` · ${clean(language.niveau)}` : ''}`).filter(Boolean)
    y = line(pdf, languages.join('     '), margin, y, contentWidth, 9, navy)
    y += 4
  }

  if (data.certifications?.length) {
    ensure(24)
    y = section(pdf, 'Certifications', y, accent)
    for (const certification of data.certifications) {
      ensure(14)
      y = line(pdf, [clean(certification.nom), clean(certification.organisme), clean(certification.date_obtention)].filter(Boolean).join(' · '), margin, y, contentWidth, 9, navy)
      y += 1.5
    }
  }

  if (data.centres_interet?.length) {
    ensure(22)
    y = section(pdf, 'Centres d’intérêt', y, accent)
    y = line(pdf, data.centres_interet.filter(Boolean).join('     '), margin, y, contentWidth, 9, navy)
  }

  if (options.showWatermark) {
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7.5)
    pdf.setTextColor(150, 150, 150)
    for (let index = 1; index <= page; index += 1) {
      pdf.setPage(index)
      pdf.text('Créé avec CVAfrik', pageWidth / 2, pageHeight - 8, { align: 'center' })
    }
  }

  return pdf
}

export function downloadCvPdf(data: CVDonnees, filename: string, options: CvPdfOptions = {}) {
  const pdf = createCvPdf(data, options)
  pdf.save(`${safeFilename(filename)}.pdf`)
}
