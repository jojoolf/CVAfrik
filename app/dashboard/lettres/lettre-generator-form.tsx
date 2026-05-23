'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Sparkles, WandSparkles } from 'lucide-react'
import { generateThreeLetters, saveLetter, type GeneratedLetter } from './actions'
import { LettrePicker } from './lettre-picker'

interface LettreGeneratorFormProps {
  cvs: { id: string; titre: string | null }[]
}

type FormStep = 'form' | 'generating' | 'pick'

export function LettreGeneratorForm({ cvs }: LettreGeneratorFormProps) {
  const router = useRouter()
  const [step, setStep] = useState<FormStep>('form')
  const [savingStyleId, setSavingStyleId] = useState<string | null>(null)
  const [generatedLetters, setGeneratedLetters] = useState<GeneratedLetter[]>([])
  const [formData, setFormData] = useState({
    cvId: cvs.length > 0 ? cvs[0].id : '',
    destinataire: '',
    entreprise: '',
    poste: '',
    offreEmploi: '',
    secteurActivite: '',
  })

  const generateLetters = async () => {
    if (!formData.cvId) {
      toast.error('Veuillez selectionner un CV de base.')
      return
    }

    setStep('generating')

    try {
      const result = await generateThreeLetters(formData)
      if (!result.success || !result.letters) {
        toast.error(result.error || 'Erreur lors de la generation.')
        setStep('form')
        return
      }

      setGeneratedLetters(result.letters)
      setStep('pick')
      toast.success('3 lettres generees avec succes !')
    } catch (error) {
      console.error(error)
      toast.error('Une erreur est survenue.')
      setStep('form')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await generateLetters()
  }

  const handleChooseLetter = async (letter: GeneratedLetter) => {
    setSavingStyleId(letter.styleId)
    try {
      const title = `Lettre - ${formData.poste} (${formData.entreprise}) - ${letter.styleLabel}`
      const result = await saveLetter({
        content: letter.content,
        titre: title,
        cvId: formData.cvId,
        offreEmploi: formData.offreEmploi,
      })

      if (!result.success) {
        toast.error(result.error || 'Erreur lors de la sauvegarde.')
        return
      }

      toast.success('Lettre sauvegardee avec succes !')
      router.push(`/dashboard/lettres/${result.id}`)
    } catch (error) {
      console.error(error)
      toast.error('Une erreur est survenue lors de la sauvegarde.')
    } finally {
      setSavingStyleId(null)
    }
  }

  if (step === 'generating') {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-14 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Generation de vos 3 lettres en cours...</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Nous preparons les versions Classique, Dynamique et Moderne.
        </p>
        <div className="mt-6 flex items-center justify-center gap-1 text-primary">
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
        </div>
      </div>
    )
  }

  if (step === 'pick') {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border bg-muted/20 p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Poste:</span> {formData.poste} chez {formData.entreprise}
            {formData.secteurActivite ? ` (${formData.secteurActivite})` : ''}
          </p>
        </div>

        <LettrePicker letters={generatedLetters} savingStyleId={savingStyleId} onChoose={handleChooseLetter} />

        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => setStep('form')}>
            Modifier le formulaire
          </Button>
          <Button type="button" onClick={generateLetters} disabled={!!savingStyleId} className="bg-primary hover:bg-primary/90">
            <WandSparkles className="mr-2 h-4 w-4" />
            Regenerer les 3 lettres
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cvId">CV de reference *</Label>
          <Select value={formData.cvId} onValueChange={(val) => setFormData((prev) => ({ ...prev, cvId: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir un CV" />
            </SelectTrigger>
            <SelectContent>
              {cvs.map((cv) => (
                <SelectItem key={cv.id} value={cv.id}>
                  {cv.titre || 'Sans titre'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] italic text-muted-foreground">
            L&apos;IA utilisera vos experiences et competences de ce CV.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="secteurActivite">Secteur d&apos;activite *</Label>
          <Input
            id="secteurActivite"
            placeholder="Ex: Technologie, Finance, Commerce, ONG..."
            value={formData.secteurActivite}
            onChange={(e) => setFormData((prev) => ({ ...prev, secteurActivite: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="entreprise">Entreprise *</Label>
          <Input
            id="entreprise"
            placeholder="Ex: Orange, Wave, Google..."
            value={formData.entreprise}
            onChange={(e) => setFormData((prev) => ({ ...prev, entreprise: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poste">Poste vise *</Label>
          <Input
            id="poste"
            placeholder="Ex: Responsable Marketing, Developpeur..."
            value={formData.poste}
            onChange={(e) => setFormData((prev) => ({ ...prev, poste: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="destinataire">Destinataire (optionnel)</Label>
          <Input
            id="destinataire"
            placeholder="Ex: M. Jean Dupont, Responsable RH"
            value={formData.destinataire}
            onChange={(e) => setFormData((prev) => ({ ...prev, destinataire: e.target.value }))}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="offreEmploi">Description de l&apos;offre (optionnel)</Label>
          <Textarea
            id="offreEmploi"
            placeholder="Copiez-collez l'offre d'emploi pour une lettre encore plus personnalisee..."
            className="min-h-[120px]"
            value={formData.offreEmploi}
            onChange={(e) => setFormData((prev) => ({ ...prev, offreEmploi: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          <Sparkles className="mr-2 h-4 w-4" />
          Generer 3 lettres
        </Button>
      </div>
    </form>
  )
}
