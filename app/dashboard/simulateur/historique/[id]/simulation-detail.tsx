'use client'

import { useRef, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Bot, User, Sparkles, Calendar, MessageSquareCode } from 'lucide-react'
import Link from 'next/link'
import { ScoreGauge } from '@/components/simulateur/score-gauge'
import { FeedbackSection } from '@/components/simulateur/feedback-section'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import jsPDF from 'jspdf'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Simulation {
  id: string
  poste: string | null
  score: number | null
  feedback: string | null
  messages: Message[]
  nombre_questions: number
  created_at: string
}

export function SimulationDetail({ sim }: { sim: Simulation }) {
  const [generating, setGenerating] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const messages = (sim.messages || []) as Message[]
  const userCount = messages.filter(m => m.role === 'user').length
  const coachCount = messages.filter(m => m.role === 'assistant').length

  const generatePDF = async () => {
    setGenerating(true)
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210
      const margin = 20
      const contentWidth = pageWidth - margin * 2
      let y = margin

      const addFooter = () => {
        const footerY = 290
        pdf.setFontSize(8)
        pdf.setTextColor(150, 150, 150)

        try {
          const img = new Image()
          img.src = '/placeholder-logo.png'
          pdf.addImage(img, 'PNG', margin, footerY, 30, 8)
        } catch {
          pdf.setFont('helvetica', 'bold')
          pdf.setFontSize(10)
          pdf.setTextColor(200, 80, 50)
          pdf.text('CVAfrik', margin, footerY + 6)
        }

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(8)
        pdf.setTextColor(150, 150, 150)
        pdf.text('Réalisé avec CVAfrik', margin, footerY + 14)
        pdf.text(`Généré le ${format(new Date(), 'dd/MM/yyyy à HH:mm')}`, margin, footerY + 19)
      }

      // Title
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(22)
      pdf.setTextColor(200, 80, 50)
      pdf.text('Rapport de Simulation', margin, y)
      y += 10

      // Info
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(11)
      pdf.setTextColor(60, 60, 60)
      pdf.text(`Poste : ${sim.poste || 'Non renseigné'}`, margin, y)
      y += 6
      pdf.text(`Date : ${format(new Date(sim.created_at), 'dd MMMM yyyy', { locale: fr })}`, margin, y)
      y += 6
      pdf.text(`Questions posées : ${coachCount}`, margin, y)
      y += 6
      pdf.text(`Réponses données : ${userCount}`, margin, y)
      y += 6

      // Score
      if (sim.score !== null) {
        y += 4
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(16)
        const scoreColor = sim.score >= 80 ? [34, 197, 94] : sim.score >= 60 ? [234, 179, 8] : [239, 68, 68]
        pdf.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
        pdf.text(`Score : ${sim.score}/100`, margin, y)
        y += 12
      }

      // Conversation
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(14)
      pdf.setTextColor(200, 80, 50)
      pdf.text('Conversation', margin, y)
      y += 8

      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.setTextColor(60, 60, 60)

      for (const msg of messages) {
        const label = msg.role === 'assistant' ? 'Coach IA : ' : 'Vous : '
        const text = `${label}${msg.content}`
        const lines = pdf.splitTextToSize(text, contentWidth)

        if (y + lines.length * 5 + 20 > 280) {
          addFooter()
          pdf.addPage()
          y = margin
        }

        pdf.setFont('helvetica', msg.role === 'assistant' ? 'normal' : 'bold')
        if (msg.role === 'assistant') {
          pdf.setTextColor(100, 100, 100)
        } else {
          pdf.setTextColor(200, 80, 50)
        }

        for (const line of lines) {
          if (y > 280) {
            addFooter()
            pdf.addPage()
            y = margin
          }
          pdf.text(line, margin, y)
          y += 5
        }
        y += 3
      }

      // Feedback
      if (sim.feedback) {
        y += 4
        if (y + 20 > 280) {
          addFooter()
          pdf.addPage()
          y = margin
        }

        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(14)
        pdf.setTextColor(200, 80, 50)
        pdf.text('Analyse de la performance', margin, y)
        y += 10

        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(10)
        pdf.setTextColor(60, 60, 60)

        const feedbackLines = pdf.splitTextToSize(sim.feedback, contentWidth)
        for (const line of feedbackLines) {
          if (y > 280) {
            addFooter()
            pdf.addPage()
            y = margin
          }
          pdf.text(line, margin, y)
          y += 5
        }
      }

      addFooter()

      pdf.save(`simulation-${sim.poste?.replace(/\s+/g, '-') || 'entretien'}-${format(new Date(sim.created_at), 'yyyy-MM-dd')}.pdf`)
    } catch (error) {
      console.error('Erreur generation PDF:', error)
    } finally {
      setGenerating(false)
    }
  }

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground'
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="space-y-6" ref={contentRef}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Button variant="ghost" size="sm" asChild className="rounded-full">
          <Link href="/dashboard/simulateur/historique">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à l&apos;historique
          </Link>
        </Button>
        <Button onClick={generatePDF} disabled={generating} className="rounded-full">
          <Download className="mr-2 h-4 w-4" />
          {generating ? 'Génération...' : 'Télécharger en PDF'}
        </Button>
      </div>

      {/* Score Card */}
      <Card className="border-green-500/20 shadow-lg overflow-hidden">
        <div className={`bg-gradient-to-b ${sim.score !== null && sim.score >= 80 ? 'from-green-500/10 to-green-500/5' : sim.score !== null && sim.score >= 60 ? 'from-amber-500/10 to-amber-500/5' : 'from-red-500/10 to-red-500/5'} p-8 text-center border-b`}>
          {sim.score !== null && <ScoreGauge score={sim.score} />}
        </div>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Poste</p>
              <p className="font-semibold text-sm mt-1 truncate">{sim.poste || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
              <p className="font-semibold text-sm mt-1">
                {format(new Date(sim.created_at), 'dd MMM yyyy', { locale: fr })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Questions</p>
              <p className="font-semibold text-sm mt-1">{coachCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Score</p>
              <p className={`font-bold text-sm mt-1 ${getScoreColor(sim.score)}`}>
                {sim.score !== null ? `${sim.score}/100` : '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <MessageSquareCode className="h-5 w-5 text-primary" />
            Conversation complète
          </h3>

          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted text-foreground rounded-tl-none border border-border/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1.5 opacity-70 text-[10px] uppercase font-bold tracking-wider">
                    {msg.role === 'assistant' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                    {msg.role === 'assistant' ? 'Coach IA' : 'Vous'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      {sim.feedback && (
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Analyse de votre performance
            </h3>
            <FeedbackSection feedback={sim.feedback} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
