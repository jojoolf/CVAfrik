'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Move, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Point = { x: number; y: number }

const VIEW_SIZE = 280
const OUTPUT_SIZE = 512

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function AvatarCropDialog({ file, onCancel, onConfirm }: { file: File; onCancel: () => void; onConfirm: (file: File, previewUrl: string) => void }) {
  const [sourceUrl, setSourceUrl] = useState('')
  const [dimensions, setDimensions] = useState({ width: 1, height: 1 })
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 })
  const drag = useRef<{ start: Point; base: Point } | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setSourceUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const geometry = useMemo(() => {
    const coverScale = Math.max(VIEW_SIZE / dimensions.width, VIEW_SIZE / dimensions.height)
    const width = dimensions.width * coverScale * zoom
    const height = dimensions.height * coverScale * zoom
    return { width, height, maxX: Math.max(0, (width - VIEW_SIZE) / 2), maxY: Math.max(0, (height - VIEW_SIZE) / 2) }
  }, [dimensions, zoom])

  const safeOffset = (point: Point) => ({ x: clamp(point.x, -geometry.maxX, geometry.maxX), y: clamp(point.y, -geometry.maxY, geometry.maxY) })

  const reset = () => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }

  const updateZoom = (nextZoom: number) => {
    setZoom(nextZoom)
    setOffset((current) => {
      const coverScale = Math.max(VIEW_SIZE / dimensions.width, VIEW_SIZE / dimensions.height)
      const width = dimensions.width * coverScale * nextZoom
      const height = dimensions.height * coverScale * nextZoom
      return { x: clamp(current.x, -Math.max(0, (width - VIEW_SIZE) / 2), Math.max(0, (width - VIEW_SIZE) / 2)), y: clamp(current.y, -Math.max(0, (height - VIEW_SIZE) / 2), Math.max(0, (height - VIEW_SIZE) / 2)) }
    })
  }

  const confirm = async () => {
    const image = new Image()
    image.src = sourceUrl
    await image.decode()
    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT_SIZE
    canvas.height = OUTPUT_SIZE
    const context = canvas.getContext('2d')
    if (!context) return

    const outputScale = Math.max(OUTPUT_SIZE / dimensions.width, OUTPUT_SIZE / dimensions.height) * zoom
    const width = dimensions.width * outputScale
    const height = dimensions.height * outputScale
    const x = (OUTPUT_SIZE - width) / 2 + (offset.x / VIEW_SIZE) * OUTPUT_SIZE
    const y = (OUTPUT_SIZE - height) / 2 + (offset.y / VIEW_SIZE) * OUTPUT_SIZE
    context.fillStyle = '#fff7ef'
    context.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
    context.drawImage(image, x, y, width, height)

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    if (!blob) return
    const croppedFile = new File([blob], `photo-profil-${Date.now()}.jpg`, { type: 'image/jpeg' })
    onConfirm(croppedFile, URL.createObjectURL(croppedFile))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="crop-title">
      <section className="w-full max-w-md rounded-t-[2rem] border border-border bg-background p-5 shadow-2xl sm:rounded-[2rem]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted sm:hidden" />
        <h2 id="crop-title" className="text-xl font-black tracking-tight text-foreground">Ajuster votre photo</h2>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">Faites glisser la photo et zoomez pour choisir le cadrage carré.</p>

        <div className="mt-5 flex justify-center">
          <div
            className="relative h-[280px] w-[280px] touch-none overflow-hidden rounded-[2rem] border-4 border-primary/20 bg-muted shadow-inner"
            onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); drag.current = { start: { x: event.clientX, y: event.clientY }, base: offset } }}
            onPointerMove={(event) => { if (!drag.current) return; setOffset(safeOffset({ x: drag.current.base.x + event.clientX - drag.current.start.x, y: drag.current.base.y + event.clientY - drag.current.start.y })) }}
            onPointerUp={() => { drag.current = null }}
            onPointerCancel={() => { drag.current = null }}
          >
            {sourceUrl && <img src={sourceUrl} alt="Aperçu de recadrage" draggable={false} onLoad={(event) => setDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })} className="pointer-events-none absolute left-1/2 top-1/2 max-w-none select-none" style={{ width: geometry.width, height: geometry.height, transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))` }} />}
            <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] ring-1 ring-inset ring-white/80" />
            <span className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/55 px-3 py-1.5 text-xs font-bold text-white"><Move className="h-3.5 w-3.5" />Déplacer</span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3"><ZoomOut className="h-4 w-4 text-muted-foreground" /><input aria-label="Niveau de zoom" type="range" min="1" max="2.5" step="0.01" value={zoom} onChange={(event) => updateZoom(Number(event.target.value))} className="h-2 flex-1 accent-primary" /><ZoomIn className="h-4 w-4 text-muted-foreground" /><Button type="button" variant="ghost" size="icon" onClick={reset} aria-label="Réinitialiser le recadrage"><RotateCcw className="h-4 w-4" /></Button></div>
        <div className="mt-6 flex gap-3"><Button type="button" variant="outline" className="h-12 flex-1 rounded-xl" onClick={onCancel}>Annuler</Button><Button type="button" className="h-12 flex-1 rounded-xl font-black" onClick={() => void confirm()}><Check className="mr-2 h-4 w-4" />Utiliser cette photo</Button></div>
      </section>
    </div>
  )
}
