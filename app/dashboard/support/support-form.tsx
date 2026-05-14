'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { submitSupportTicket } from './actions'

export function SupportForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sujet: '',
    message: '',
    priorite: 'normale',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.sujet || !formData.message) {
      return toast.error('Veuillez remplir tous les champs obligatoires.')
    }

    setLoading(true)
    try {
      const result = await submitSupportTicket(formData)
      if (result.success) {
        toast.success('Votre message a ete envoye. Nous reviendrons vers vous bientot !')
        setFormData({ sujet: '', message: '', priorite: 'normale' })
      } else {
        toast.error(result.error || 'Erreur lors de l\'envoi.')
      }
    } catch (error) {
      toast.error('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sujet">Sujet de votre demande *</Label>
          <Select 
            value={formData.sujet} 
            onValueChange={(val) => setFormData(prev => ({ ...prev, sujet: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un sujet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paiement">Probleme de paiement</SelectItem>
              <SelectItem value="Technique">Bug ou probleme technique</SelectItem>
              <SelectItem value="Compte">Gestion de mon compte</SelectItem>
              <SelectItem value="Aide CV">Aide pour mon CV / Lettre</SelectItem>
              <SelectItem value="Autre">Autre demande</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priorite">Priorite</Label>
          <Select 
            value={formData.priorite} 
            onValueChange={(val) => setFormData(prev => ({ ...prev, priorite: val }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basse">Basse</SelectItem>
              <SelectItem value="normale">Normale</SelectItem>
              <SelectItem value="urgente">Urgente 🔥</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Votre message *</Label>
        <Textarea 
          id="message" 
          placeholder="Expliquez-nous votre besoin en details..." 
          className="min-h-[150px]"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          required
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Envoyer le message
          </>
        )}
      </Button>
    </form>
  )
}
