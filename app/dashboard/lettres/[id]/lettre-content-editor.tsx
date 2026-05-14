'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateLettreContent } from '../actions'

interface LettreContentEditorProps {
  initialContent: string
  id: string
}

export function LettreContentEditor({ initialContent, id }: LettreContentEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const result = await updateLettreContent(id, content)
      if (result.success) {
        toast.success('Modifications enregistrees !')
        setHasChanges(false)
      } else {
        toast.error('Erreur lors de l\'enregistrement.')
      }
    } catch (error) {
      toast.error('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (val: string) => {
    setContent(val)
    setHasChanges(val !== initialContent)
  }

  return (
    <div className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        className="min-h-[500px] leading-relaxed resize-none border-none focus-visible:ring-0 p-0 text-base"
        placeholder="Le contenu de votre lettre..."
      />
      
      {hasChanges && (
        <div className="fixed bottom-10 right-10 animate-in fade-in slide-in-from-bottom-4">
          <Button onClick={handleSave} disabled={loading} className="shadow-xl">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer les modifications
          </Button>
        </div>
      )}
    </div>
  )
}
