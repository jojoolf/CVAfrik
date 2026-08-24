'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ACCEPTED_IMAGE_ACCEPT, imageExtensionFromMimeType, validateImageFile } from '@/lib/images/client-validation'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  bucket?: string
}

export function ImageUpload({ value, onChange, bucket = 'blog-images' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImageFile(file, 5 * 1024 * 1024)
    if (validationError) {
      toast.error(validationError)
      e.target.value = ''
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const extension = imageExtensionFromMimeType(file.type)
      const randomId = globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
      const fileName = `covers/${Date.now()}-${randomId}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      const publicUrl = urlData.publicUrl
      setPreview(publicUrl)
      onChange(publicUrl)
      toast.success('Image uploadée avec succes')
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview('')
    onChange('')
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_IMAGE_ACCEPT}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="gap-2"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? 'Upload en cours...' : 'Choisir une image'}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-9 w-9 text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30">
          <img
            src={preview}
            alt="Apercu"
            className="max-h-48 w-full object-cover"
            onError={() => setPreview('')}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-border bg-muted/20 text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <ImageIcon className="h-6 w-6" />
            <span className="text-xs">Aucune image selectionnee</span>
          </div>
        </div>
      )}
    </div>
  )
}
