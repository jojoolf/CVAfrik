import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, CheckCircle2, FileSignature, FileText, MessageSquareCode, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SocialFollowCard } from '@/components/profile/social-follow-card'

export function MobileDashboardOverview({
  displayName,
  totalCVs,
  totalLetters,
  completion,
}: {
  displayName: string
  totalCVs: number
  totalLetters: number
  completion: number
}) {
  const firstName = displayName.split(' ')[0] || 'vous'
  const quickActions = [
    { title: 'Mon CV', description: `${totalCVs} CV enregistré${totalCVs > 1 ? 's' : ''}`, href: '/cv-builder', icon: FileText, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-300' },
    { title: 'Lettre', description: `${totalLetters} lettre${totalLetters > 1 ? 's' : ''}`, href: '/dashboard/lettres?new=true', icon: FileSignature, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
    { title: 'Entretien', description: 'Se préparer', href: '/dashboard/simulateur', icon: MessageSquareCode, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-300' },
  ]

  return (
    <div className="native-mobile-only mx-auto max-w-lg space-y-5 px-4 pb-7 pt-5">
      <section>
        <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Tableau de bord</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">Bonjour, {firstName}</h1>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">Prêt à avancer dans votre carrière ?</p>
      </section>

      <section className="flex items-center gap-4 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-amber-500/10 p-4 shadow-sm">
        <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(hsl(var(--primary)) ${completion * 3.6}deg, hsl(var(--muted)) 0deg)` }}>
          <div className="grid h-16 w-16 place-items-center rounded-full bg-card text-lg font-black text-foreground">{completion}%</div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">Votre profil</p>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">Complétez votre profil pour mieux valoriser votre parcours.</p>
          <Link href="/profil/modifier" className="mt-2 inline-flex items-center text-sm font-bold text-primary">Compléter <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
        </div>
      </section>

      <Button asChild className="h-14 w-full rounded-2xl text-base font-black shadow-lg shadow-primary/20 active:scale-[0.98]">
        <Link href="/cv-builder"><FileText className="mr-2 h-5 w-5" />Créer mon CV</Link>
      </Button>

      <section>
        <h2 className="mb-3 text-lg font-black tracking-tight text-foreground">Actions rapides</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon
            return <Link key={action.title} href={action.href} className="rounded-2xl border border-border bg-card p-3 shadow-sm transition active:scale-[0.97]">
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${action.color}`}><Icon className="h-4.5 w-4.5" /></span>
              <span className="mt-3 block text-sm font-black text-foreground">{action.title}</span>
              <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">{action.description}</span>
            </Link>
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300"><CheckCircle2 className="h-5 w-5" /></span>
          <div className="min-w-0 flex-1"><p className="text-sm font-bold text-foreground">À faire aujourd’hui</p><p className="mt-0.5 text-xs leading-5 text-muted-foreground">Ajoutez votre expérience ou créez votre premier CV.</p></div>
          <Link href="/profil/modifier" className="text-primary"><ArrowRight className="h-5 w-5" /></Link>
        </div>
      </section>

      <Link href="/opportunites" className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 shadow-sm transition active:scale-[0.98]">
        <span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"><BriefcaseBusiness className="h-5 w-5" /></span><span><span className="block text-sm font-bold text-foreground">Découvrir les opportunités</span><span className="mt-0.5 block text-xs text-muted-foreground">Emplois, stages et bourses</span></span></span>
        <ArrowRight className="h-5 w-5 text-primary" />
      </Link>

      <SocialFollowCard mobileOnly />
    </div>
  )
}
