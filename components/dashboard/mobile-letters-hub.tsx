import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, FileSignature, GraduationCap, Send, Sparkles } from 'lucide-react'

const types = [
  { title: 'Lettre de motivation', description: 'Pour une offre d’emploi', href: '/dashboard/lettres?new=true', icon: FileSignature },
  { title: 'Candidature spontanée', description: 'Présentez votre profil', href: '/dashboard/lettres?new=true', icon: Send },
  { title: 'Demande de stage', description: 'Valorisez votre parcours', href: '/dashboard/lettres?new=true', icon: GraduationCap },
]

export function MobileLettersHub({ letters }: { letters: Array<{ id: string; titre: string; created_at: string }> }) {
  return (
    <div className="native-mobile-only mx-auto max-w-lg px-4 pb-7 pt-5">
      <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Candidature</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">Mes lettres</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Des lettres simples, adaptées à chaque candidature.</p>
      <Link href="/dashboard/lettres?new=true" className="mt-5 flex h-14 items-center justify-center rounded-2xl bg-primary text-base font-black text-primary-foreground shadow-lg shadow-primary/20 transition active:scale-[0.98]"><FileSignature className="mr-2 h-5 w-5" />Nouvelle lettre</Link>
      <h2 className="mt-7 text-lg font-black text-foreground">Commencer rapidement</h2>
      <div className="mt-3 space-y-3">{types.map((type) => { const Icon = type.icon; return <Link key={type.title} href={type.href} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition active:scale-[0.99]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"><Icon className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-black text-foreground">{type.title}</span><span className="mt-1 block text-xs text-muted-foreground">{type.description}</span></span><ArrowRight className="h-5 w-5 text-primary" /></Link>})}</div>
      <h2 className="mt-7 text-lg font-black text-foreground">Dernières lettres</h2>
      <div className="mt-3 space-y-3">{letters.length ? letters.slice(0, 4).map((letter) => <Link key={letter.id} href={`/dashboard/lettres/${letter.id}`} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition active:scale-[0.99]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><BriefcaseBusiness className="h-5 w-5" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-black text-foreground">{letter.titre || 'Lettre sans titre'}</span><span className="mt-1 block text-xs text-muted-foreground">{new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(letter.created_at))}</span></span><ArrowRight className="h-5 w-5 text-primary" /></Link>) : <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-10 text-center"><FileSignature className="mx-auto h-7 w-7 text-primary" /><p className="mt-3 text-sm font-bold text-foreground">Aucune lettre pour le moment</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Commencez par créer votre première lettre de motivation.</p></div>}</div>
    </div>
  )
}
