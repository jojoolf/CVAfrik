'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Sparkles, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface NewsletterPopupProps {
  userEmail?: string
  userName?: string
}

export function NewsletterPopup({ userEmail, userName }: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState(userEmail || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà vu la popup
    const hasSeenPopup = localStorage.getItem('newsletter_prompted')
    
    if (!hasSeenPopup) {
      // Afficher la popup après 3 secondes
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem('newsletter_prompted', 'true')
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    const supabase = createClient()

    try {
      // Vérifier si déjà inscrit pour éviter les erreurs d'unicité
      const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email)
        .single()

      if (!existing) {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .insert({
            email,
            prenom: userName || null
          })

        if (error) throw error
      }

      toast.success('Merci pour votre inscription ! 🎉')
      handleClose()
    } catch (error) {
      console.error(error)
      toast.error('Une erreur est survenue, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose()
    }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl bg-gradient-to-br from-white to-slate-50">
        <div className="relative">
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary to-accent opacity-10"></div>
          
          <div className="p-8 pt-10 text-center relative z-10">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 text-center flex items-center justify-center gap-2">
                Ne ratez aucune offre ! <Sparkles className="h-5 w-5 text-amber-400" />
              </DialogTitle>
              <DialogDescription className="text-center text-slate-500 mt-2 text-base">
                Abonnez-vous à notre newsletter pour recevoir en exclusivité les dernières <strong>offres d'emploi, stages</strong> et nos meilleurs conseils pour booster votre carrière en Afrique.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubscribe} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-14 text-center rounded-2xl bg-white shadow-sm border-slate-200 focus-visible:ring-primary"
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-14 rounded-2xl font-bold text-base bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "M'abonner gratuitement"
                )}
              </Button>
            </form>
            
            <button 
              onClick={handleClose}
              className="mt-6 text-sm text-slate-400 hover:text-slate-600 underline underline-offset-4 transition-colors"
            >
              Non merci, peut-être plus tard
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
