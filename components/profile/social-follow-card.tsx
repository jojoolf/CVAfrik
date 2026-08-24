import { Instagram, Linkedin, Mail, Music2, UsersRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const networks = [
  { name: 'TikTok', icon: Music2, color: 'text-foreground' },
  { name: 'Facebook', icon: UsersRound, color: 'text-blue-600 dark:text-blue-300' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-600 dark:text-pink-300' },
  { name: 'LinkedIn', icon: Linkedin, color: 'text-sky-700 dark:text-sky-300' },
] as const

export function SocialFollowCard({ mobileOnly = false, className }: { mobileOnly?: boolean; className?: string }) {
  return (
    <section className={cn(mobileOnly && 'native-mobile-only', 'rounded-3xl border border-border bg-card p-4 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-4">
        <div><h2 className="text-lg font-black tracking-tight text-foreground">Suivez-nous</h2><p className="mt-1 text-sm leading-5 text-muted-foreground">Retrouvez bientôt CVAfrik sur vos réseaux sociaux préférés.</p></div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><UsersRound className="h-5 w-5" /></span>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {networks.map((network) => {
          const Icon = network.icon
          return <div key={network.name} className="text-center">
            <div title={`${network.name} · compte CVAfrik bientôt disponible`} className="grid h-13 w-full place-items-center rounded-2xl border border-border bg-muted/55"><Icon className={`h-6 w-6 ${network.color}`} /></div>
            <p className="mt-2 truncate text-[11px] font-bold text-foreground">{network.name}</p>
            <p className="mt-0.5 text-[9px] font-semibold text-muted-foreground">Bientôt</p>
          </div>
        })}
      </div>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-3"><p className="text-xs leading-5 text-muted-foreground">En attendant, contacte directement l’équipe CVAfrik.</p><Button asChild size="sm" className="h-9 shrink-0 rounded-xl"><a href="mailto:cvafrik@gmail.com"><Mail className="mr-1.5 h-3.5 w-3.5" />Écrire</a></Button></div>
    </section>
  )
}
