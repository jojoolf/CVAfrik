'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Send, Sparkles, User, Bot, CheckCircle2, Maximize2, Minimize2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { startSimulation, sendMessage } from './actions'
import { ScoreGauge } from '@/components/simulateur/score-gauge'
import { FeedbackSection } from '@/components/simulateur/feedback-section'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function getNombreQuestions(value: string): number {
  if (value === 'aleatoire') {
    return Math.floor(Math.random() * 8) + 8
  }
  return parseInt(value)
}

function AutoResizeTextarea({ value, onChange, placeholder, disabled, onKeyDown, className }: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder: string
  disabled?: boolean
  onKeyDown?: (e: React.KeyboardEvent) => void
  className?: string
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    }
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onKeyDown={onKeyDown}
      rows={1}
      className={cn(
        'flex w-full rounded-xl border border-input bg-background px-4 py-3',
        'text-sm ring-offset-background placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'resize-none min-h-[44px] max-h-[200px]',
        'scrollbar-thin',
        className
      )}
    />
  )
}



export function InterviewChat({ cvs }: { cvs: { id: string; titre: string | null }[] }) {
  const [step, setStep] = useState<'setup' | 'chat' | 'result'>('setup')
  const [loading, setLoading] = useState(false)
  const [setupData, setSetupData] = useState({
    cvId: cvs.length > 0 ? cvs[0].id : '',
    poste: '',
    nombreQuestions: '8',
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [simulationId, setSimulationId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (step === 'chat' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [step])

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!setupData.poste) return toast.error('Veuillez indiquer le poste.')

    setLoading(true)
    try {
      const nombreQuestions = getNombreQuestions(setupData.nombreQuestions)
      const result = await startSimulation({
        cvId: setupData.cvId,
        poste: setupData.poste,
        nombreQuestions,
      })
      if (result.success && result.id && result.firstQuestion) {
        setSimulationId(result.id)
        setMessages([{ role: 'assistant', content: result.firstQuestion }])
        setStep('chat')
      } else {
        toast.error(result.error || 'Erreur lors du demarrage.')
      }
    } catch (error) {
      toast.error('Erreur lors du demarrage.')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)

    setLoading(true)
    try {
      const result = await sendMessage(simulationId!, userMsg, newMessages)
      if (result.success) {
        if (result.isFinished) {
          setFeedback(result.feedback ?? 'Feedback indisponible pour cette simulation.')
          setScore(typeof result.score === 'number' ? result.score : 0)
          setStep('result')
        } else if (result.nextQuestion) {
          setMessages([...newMessages, { role: 'assistant', content: result.nextQuestion }])
        } else {
          toast.error('Reponse du coach invalide.')
        }
      } else {
        toast.error(result.error || "Erreur lors de l'envoi.")
      }
    } catch (error) {
      toast.error('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e as unknown as React.FormEvent)
    }
  }

  if (step === 'setup') {
    return (
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">Configurer votre simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStart} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Choisissez le CV avec lequel vous postulez</Label>
              <Select
                value={setupData.cvId}
                onValueChange={(val) => setSetupData((prev) => ({ ...prev, cvId: val }))}
              >
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
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quel poste visez-vous ?</Label>
              <Input
                placeholder="Ex: Developpeur Front-end, Commercial..."
                value={setupData.poste}
                onChange={(e) => setSetupData((prev) => ({ ...prev, poste: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nombre de questions</Label>
              <Select
                value={setupData.nombreQuestions}
                onValueChange={(val) => setSetupData((prev) => ({ ...prev, nombreQuestions: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le nombre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="8">8 questions (Recommandé)</SelectItem>
                  <SelectItem value="10">10 questions</SelectItem>
                  <SelectItem value="15">15 questions</SelectItem>
                  <SelectItem value="aleatoire">Aléatoire (8-15)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Plus il y a de questions, plus l&apos;analyse sera précise.
              </p>
            </div>
            <Button type="submit" className="w-full bg-primary h-12 text-base" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
              Commencer l&apos;entretien
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  if (step === 'chat') {
    return (
      <Card
        className={cn(
          'border-primary/20 flex flex-col shadow-xl overflow-hidden transition-all duration-200',
          isExpanded
            ? 'h-[calc(100vh-140px)] max-h-[900px]'
            : 'h-[calc(100vh-260px)] min-h-[480px] max-h-[680px]',
        )}
      >
        <CardHeader className="bg-primary/5 border-b py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shrink-0" />
              <CardTitle className="text-sm font-medium truncate">
                Simulation en cours &mdash; {setupData.poste}
              </CardTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-label={isExpanded ? 'Reduire la fenetre' : 'Agrandir la fenetre'}
              title={isExpanded ? 'Reduire la fenetre' : 'Agrandir la fenetre'}
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 min-h-0 flex flex-col p-0 overflow-hidden bg-background">
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <div className="space-y-4 pb-4">
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
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 border border-border/50">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground">Coach IA réfléchit...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSend} className="p-4 border-t bg-muted/20">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <AutoResizeTextarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tapez votre reponse ici... (Entrée pour envoyer, Maj+Entrée pour sauter une ligne)"
                  disabled={loading}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button type="submit" size="icon" className="h-[44px] w-[44px] rounded-xl shrink-0" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-500/20 shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-b from-green-500/10 to-green-500/5 p-8 text-center border-b border-green-500/20">
        <div className="mx-auto w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Simulation terminée !</h2>

        <div className="mt-6 flex justify-center">
          {score !== null && <ScoreGauge score={score} />}
        </div>

        {score !== null && (
          <div className="mt-4 flex justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Bot className="h-3.5 w-3.5" />
              {messages.filter(m => m.role === 'assistant').length} questions posées
            </span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {messages.filter(m => m.role === 'user').length} réponses données
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-8">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          Analyse détaillée de votre performance
        </h3>

        {feedback && <FeedbackSection feedback={feedback} />}

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" variant="default" onClick={() => setStep('setup')}>
            <Sparkles className="mr-2 h-4 w-4" />
            Nouvelle simulation
          </Button>
          <Button className="flex-1" variant="outline" onClick={() => {
            setStep('setup')
            setMessages([])
            setFeedback(null)
            setScore(null)
            setSimulationId(null)
          }}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
