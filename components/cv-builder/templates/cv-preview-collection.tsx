import type { ReactElement } from 'react'
import type { CVDonnees } from '@/lib/types'
import { CVPreviewClassique } from './cv-preview-classique'
import { CVPreviewModerne } from './cv-preview-moderne'
import { CVPreviewCreatif } from './cv-preview-creatif'
import { CVPreviewExecutif } from './cv-preview-executif'
import { CVPreviewTech } from './cv-preview-tech'
import { CVPreviewMinimaliste } from './cv-preview-minimaliste'
import { CVPreviewStartup } from './cv-preview-startup'
import { CVPreviewLuxe } from './cv-preview-luxe'
import { CVPreviewElite } from './cv-preview-elite'
import { CVPreviewDesign } from './cv-preview-design'

interface CVTemplateProps {
  data: CVDonnees
  showWatermark?: boolean
}

interface FilteredTemplateProps extends CVTemplateProps {
  filter: string
  backgroundClassName?: string
  BaseComponent: (props: CVTemplateProps) => ReactElement
}

function FilteredTemplate({
  data,
  showWatermark = false,
  filter,
  backgroundClassName = 'bg-white',
  BaseComponent,
}: FilteredTemplateProps) {
  return (
    <div className={backgroundClassName}>
      <div style={{ filter }}>
        <BaseComponent data={data} showWatermark={showWatermark} />
      </div>
    </div>
  )
}

export function CVPreviewNeoClassique(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewClassique}
      filter="hue-rotate(15deg) saturate(1.08) contrast(1.03)"
      backgroundClassName="bg-slate-50"
    />
  )
}

export function CVPreviewMarine(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewModerne}
      filter="hue-rotate(38deg) saturate(1.18) contrast(1.04)"
      backgroundClassName="bg-blue-50"
    />
  )
}

export function CVPreviewTerracotta(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewModerne}
      filter="hue-rotate(-20deg) saturate(1.22) brightness(1.01)"
      backgroundClassName="bg-orange-50"
    />
  )
}

export function CVPreviewForest(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewExecutif}
      filter="hue-rotate(82deg) saturate(1.16) contrast(1.04)"
      backgroundClassName="bg-emerald-50"
    />
  )
}

export function CVPreviewRoyal(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewElite}
      filter="hue-rotate(55deg) saturate(1.14) contrast(1.05)"
      backgroundClassName="bg-indigo-50"
    />
  )
}

export function CVPreviewAqua(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewTech}
      filter="hue-rotate(24deg) saturate(1.25) brightness(1.02)"
      backgroundClassName="bg-cyan-50"
    />
  )
}

export function CVPreviewBordeaux(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewLuxe}
      filter="hue-rotate(-38deg) saturate(1.2) contrast(1.03)"
      backgroundClassName="bg-rose-50"
    />
  )
}

export function CVPreviewMint(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewMinimaliste}
      filter="hue-rotate(92deg) saturate(1.16) brightness(1.02)"
      backgroundClassName="bg-emerald-50"
    />
  )
}

export function CVPreviewNoirOr(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewClassique}
      filter="contrast(1.15) saturate(0.95) brightness(0.93)"
      backgroundClassName="bg-stone-100"
    />
  )
}

export function CVPreviewSunset(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewStartup}
      filter="hue-rotate(-28deg) saturate(1.28) brightness(1.04)"
      backgroundClassName="bg-amber-50"
    />
  )
}

export function CVPreviewLavande(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewCreatif}
      filter="hue-rotate(48deg) saturate(1.1) contrast(1.04)"
      backgroundClassName="bg-violet-50"
    />
  )
}

export function CVPreviewGraphite(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewExecutif}
      filter="saturate(0.75) contrast(1.09) brightness(0.98)"
      backgroundClassName="bg-slate-100"
    />
  )
}

export function CVPreviewRuby(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewDesign}
      filter="hue-rotate(-45deg) saturate(1.24) contrast(1.05)"
      backgroundClassName="bg-red-50"
    />
  )
}

export function CVPreviewNordic(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewMinimaliste}
      filter="hue-rotate(14deg) saturate(0.9) contrast(1.02)"
      backgroundClassName="bg-sky-50"
    />
  )
}

export function CVPreviewAurora(props: CVTemplateProps) {
  return (
    <FilteredTemplate
      {...props}
      BaseComponent={CVPreviewTech}
      filter="hue-rotate(118deg) saturate(1.3) contrast(1.05)"
      backgroundClassName="bg-teal-50"
    />
  )
}
