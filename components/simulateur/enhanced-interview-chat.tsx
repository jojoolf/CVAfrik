'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Loader2, Send, Sparkles, User, Bot, CheckCircle2, Maximize2, Minimize2, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { startEnhancedSimulation, sendEnhancedMessage } from '@/app/dashboard/simulateur/actions'
import { ScoreGauge } from './score-gauge'
import { InterviewSetup } from './interview-setup'
import { EnhancedFeedbackDisplay } from './enhanced-feedback-display'
import type { InterviewFeedback } from '@/lib/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
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

export function EnhancedInterviewChat({ cvs }: { cvs: { id: string; titre: string | null }[] }) {
  const [step, setStep] = useState<'setup' | 'chat' | 'result'>('setup')
  const [loading, setLoading] = useState(false)
  const [setupData, setSetupData] = useState({
    cvId: cvs.length > 0 ? cvs[0].id : '',
    poste: '',
    sector: 'tech' as 'finance' | 'tech' | 'marketing' | 'hr' | 'sales' | 'other',
    interviewType: 'mixed' as 'behavioral' | 'technical' | 'mixed' | 'case_study',
    nombreQuestions: 5,
  })
  
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [simulationId, setSimulationId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null)
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

  const handleStartSimulation = async (data: {
    cvId: string
    poste: string
    sector: 'finance' | 'tech' | 'marketing' | 'hr' | 'sales' | 'other'
    interviewType: 'behavioral' | 'technical' | 'mixed' | 'case_study'
    nombreQuestions: number
  }) => {
    setSetupData(data)
    setLoading(true)
    try {
      const result = await startEnhancedSimulation(data)
      if (result.success && result.id && result.firstQuestion) {
        setSimulationId(result.id)
        setMessages([{ role: 'assistant', content: result.firstQuestion }])
        setStep('chat')
      } else {
        toast.error(result.error || 'Erreur lors du démarrage.')
      }
    } catch (error) {
      toast.error('Erreur lors du démarrage de la simulation.')
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
      const result = await sendEnhancedMessage(simulationId!, userMsg, newMessages)
      if (result.success) {
        if (result.isFinished) {
          setFeedback(result.feedback as any)
          setScore(typeof result.score === 'number' ? result.score : 0)
          setStep('result')
        } else if (result.nextQuestion) {
          setMessages([...newMessages, { role: 'assistant', content: result.nextQuestion }])
        } else {
          toast.error('Réponse invalide du coach.')
        }
      } else {
        toast.error(result.error || "Erreur de transmission.")
      }
    } catch (error) {
      toast.error('Une erreur technique est survenue.')
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

  // Helper to get formatted sector and type names
  const getSectorLabel = (id: string) => {
    switch (id) {
      case 'finance': return 'Finance 💼'
      case 'tech': return 'Tech/IT 💻'
      case 'marketing': return 'Marketing 📊'
      case 'hr': return 'RH 👥'
      case 'sales': return 'Vente 📈'
      default: return 'Autre Secteur ⭐'
    }
  }

  const getTypeLabel = (id: string) => {
    switch (id) {
      case 'behavioral': return 'Comportemental 🎯'
      case 'technical': return 'Technique ⚙️'
      case 'case_study': return 'Cas Pratique 📋'
      default: return 'Mixte 🔀'
    }
  }

  if (step === 'setup') {
    return <InterviewSetup cvs={cvs} loading={loading} onStart={handleStartSimulation} />
  }

  if (step === 'chat') {
    const assistantMsgCount = messages.filter(m => m.role === 'assistant').length
    const progressPercent = Math.min((assistantMsgCount / setupData.nombreQuestions) * 100, 100)

    return (
      <Card
        className={cn(
          'border-violet-500/20 flex flex-col shadow-xl overflow-hidden transition-all duration-200 bg-background',
          isExpanded
            ? 'h-[calc(100vh-140px)] max-h-[900px]'
            : 'h-[calc(100vh-260px)] min-h-[480px] max-h-[680px]',
        )}
      >
        <CardHeader className="bg-gradient-to-r from-violet-500/5 via-primary/5 to-transparent border-b py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                <CardTitle className="text-sm font-bold truncate text-foreground">
                  Entretien : {setupData.poste}
                </CardTitle>
              </div>
              <div className="flex gap-2 text-[10px] text-muted-foreground mt-1 font-semibold">
                <span className="bg-muted px-1.5 py-0.5 rounded">{getSectorLabel(setupData.sector)}</span>
                <span className="bg-muted px-1.5 py-0.5 rounded">{getTypeLabel(setupData.interviewType)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-violet-600 bg-violet-600/10 px-2 py-0.5 rounded">
                Q. {assistantMsgCount} / {setupData.nombreQuestions}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 hover:bg-muted"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Progress value={progressPercent} className="h-1 mt-2.5 bg-muted" />
        </CardHeader>

        <CardContent className="flex-1 min-h-0 flex flex-col p-0 overflow-hidden bg-background">
          <div className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
            <div className="space-y-4 pb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-violet-600 text-white rounded-tr-none'
                        : 'bg-muted/80 text-foreground rounded-tl-none border border-border/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 opacity-75 text-[9px] uppercase font-black tracking-wider">
                      {msg.role === 'assistant' ? <Bot className="h-3 w-3 text-violet-500" /> : <User className="h-3 w-3 text-violet-300" />}
                      {msg.role === 'assistant' ? 'Coach IA' : 'Vous'}
                    </div>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted/60 rounded-2xl rounded-tl-none px-4 py-3 border border-border/40">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-600" />
                      <span className="text-xs text-muted-foreground font-semibold">Le coach formule la question...</span>
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
                  placeholder="Tapez votre réponse ici... (Entrée pour envoyer, Maj+Entrée pour sauter une ligne)"
                  disabled={loading}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button 
                type="submit" 
                size="icon" 
                className="h-[44px] w-[44px] rounded-xl shrink-0 bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-600/10" 
                disabled={loading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-500/20 shadow-2xl overflow-hidden bg-background">
      <div className="bg-gradient-to-b from-green-500/10 to-green-500/5 p-8 text-center border-b border-green-500/15">
        <div className="mx-auto w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Simulation terminée !</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Votre score global a été calculé sur la base de vos réponses sectorielles.
        </p>

        <div className="mt-6 flex justify-center">
          {score !== null && <ScoreGauge score={score} />}
        </div>
      </div>

      <CardContent className="p-6 md:p-8">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-violet-500" />
          Analyse détaillée de votre performance
        </h3>

        {feedback && <EnhancedFeedbackDisplay feedback={feedback} />}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button 
            className="flex-1 h-11 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all" 
            variant="default" 
            onClick={() => {
              setStep('setup')
              setMessages([])
              setFeedback(null)
              setScore(null)
              setSimulationId(null)
            }}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Nouvelle simulation
          </Button>
          <Button 
            className="flex-1 h-11 rounded-xl" 
            variant="outline" 
            onClick={() => {
              setStep('setup')
              setMessages([])
              setFeedback(null)
              setScore(null)
              setSimulationId(null)
            }}
          >
            Retour à l&apos;accueil
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
