'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Send, Sparkles, User, Bot, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { startSimulation, sendMessage } from './actions'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function InterviewChat({ cvs }: { cvs: { id: string; titre: string | null }[] }) {
  const [step, setStep] = useState<'setup' | 'chat' | 'result'>('setup')
  const [loading, setLoading] = useState(false)
  const [setupData, setSetupData] = useState({
    cvId: cvs.length > 0 ? cvs[0].id : '',
    poste: '',
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [simulationId, setSimulationId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!setupData.poste) return toast.error('Veuillez indiquer le poste.')
    
    setLoading(true)
    try {
      const result = await startSimulation(setupData)
      if (result.success) {
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
          setFeedback(result.feedback)
          setScore(result.score)
          setStep('result')
        } else {
          setMessages([...newMessages, { role: 'assistant', content: result.nextQuestion }])
        }
      } else {
        toast.error('Erreur lors de l\'envoi.')
      }
    } catch (error) {
      toast.error('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'setup') {
    return (
      <Card className="border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Configurer votre simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleStart} className="space-y-4">
            <div className="space-y-2">
              <Label>Choisissez le CV avec lequel vous postulez</Label>
              <Select 
                value={setupData.cvId} 
                onValueChange={(val) => setSetupData(prev => ({ ...prev, cvId: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un CV" />
                </SelectTrigger>
                <SelectContent>
                  {cvs.map(cv => (
                    <SelectItem key={cv.id} value={cv.id}>{cv.titre || 'Sans titre'}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quel poste visez-vous ?</Label>
              <Input 
                placeholder="Ex: Developpeur Front-end, Commercial..." 
                value={setupData.poste}
                onChange={(e) => setSetupData(prev => ({ ...prev, poste: e.target.value }))}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Commencer l&apos;entretien
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  if (step === 'chat') {
    return (
      <Card className="border-primary/20 flex flex-col h-[600px] shadow-xl overflow-hidden">
        <CardHeader className="bg-primary/5 border-b py-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Simulation en cours — {setupData.poste}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden bg-background">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted text-foreground rounded-tl-none border border-border/50'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1 opacity-70 text-[10px] uppercase font-bold tracking-wider">
                      {msg.role === 'assistant' ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {msg.role === 'assistant' ? 'Coach IA' : 'Vous'}
                    </div>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3 border border-border/50">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <form onSubmit={handleSend} className="p-4 border-t bg-muted/20 flex gap-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Tapez votre reponse ici..." 
              className="bg-background rounded-full px-4"
              disabled={loading}
            />
            <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={loading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-green-500/20 shadow-2xl overflow-hidden">
      <div className="bg-green-500/10 p-8 text-center border-b border-green-500/20">
        <div className="mx-auto w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-green-700">Simulation terminee !</h2>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-sm font-medium text-green-600">Votre score :</span>
          <div className="text-4xl font-black text-green-700">{score}%</div>
        </div>
      </div>
      <CardContent className="p-8">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          Analyse de votre performance
        </h3>
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {feedback}
        </div>
        <Button className="w-full mt-8" variant="outline" onClick={() => setStep('setup')}>
          Recommencer une simulation
        </Button>
      </CardContent>
    </Card>
  )
}
