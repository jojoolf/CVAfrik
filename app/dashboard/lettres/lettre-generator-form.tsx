'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Sparkles } from 'lucide-react'
import { generateCoverLetter } from './actions'

interface LettreGeneratorFormProps {
  cvs: { id: string; titre: string | null }[]
  profile: any
}

export function LettreGeneratorForm({ cvs, profile }: LettreGeneratorFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cvId: cvs.length > 0 ? cvs[0].id : '',
    destinataire: '',
    entreprise: '',
    poste: '',
    offreEmploi: '',
    style: 'professionnel',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.cvId) {
      toast.error('Veuillez selectionner un CV de base.')
      return
    }

    setLoading(true)
    try {
      const result = await generateCoverLetter(formData)
      if (result.success) {
        toast.success('Lettre generee avec succes !')
        router.push(`/dashboard/lettres/${result.id}`)
      } else {
        toast.error(result.error || 'Erreur lors de la generation.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="cvId">CV de reference *</Label>
          <Select 
            value={formData.cvId} 
            onValueChange={(val) => setFormData(prev => ({ ...prev, cvId: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un CV" />
            </SelectTrigger>
            <SelectContent>
              {cvs.map(cv => (
                <SelectItem key={cv.id} value={cv.id}>
                  {cv.titre || 'Sans titre'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground italic">
            L'IA utilisera vos experiences et competences de ce CV.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="style">Ton de la lettre</Label>
          <Select 
            value={formData.style} 
            onValueChange={(val) => setFormData(prev => ({ ...prev, style: val }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professionnel">Professionnel & Formel</SelectItem>
              <SelectItem value="dynamique">Dynamique & Enthousiaste</SelectItem>
              <SelectItem value="minimaliste">Minimaliste & Direct</SelectItem>
              <SelectItem value="creatif">Creatif & Original</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="entreprise">Entreprise *</Label>
          <Input 
            id="entreprise" 
            placeholder="Ex: Orange, Wave, Google..." 
            value={formData.entreprise}
            onChange={(e) => setFormData(prev => ({ ...prev, entreprise: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="poste">Poste vise *</Label>
          <Input 
            id="poste" 
            placeholder="Ex: Responsable Marketing, Developpeur..." 
            value={formData.poste}
            onChange={(e) => setFormData(prev => ({ ...prev, poste: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="destinataire">Destinataire (Optionnel)</Label>
          <Input 
            id="destinataire" 
            placeholder="Ex: M. Jean Dupont, Responsable RH" 
            value={formData.destinataire}
            onChange={(e) => setFormData(prev => ({ ...prev, destinataire: e.target.value }))}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="offreEmploi">Description de l'offre (Optionnel)</Label>
          <Textarea 
            id="offreEmploi" 
            placeholder="Copiez-collez l'offre d'emploi pour une lettre encore plus personnalisee..." 
            className="min-h-[120px]"
            value={formData.offreEmploi}
            onChange={(e) => setFormData(prev => ({ ...prev, offreEmploi: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={() => router.back()} disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generation en cours...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generer ma lettre
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
