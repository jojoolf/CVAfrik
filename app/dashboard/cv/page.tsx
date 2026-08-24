import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, FileText, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata = { title: 'Mes CV | CVAfrik' }

export default async function MyCvsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const { data: cvs } = await supabase
    .from('cvs')
    .select('id,titre,template,updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="mx-auto max-w-3xl px-4 pb-8 pt-5 sm:px-6 sm:pt-8">
      <div className="native-mobile-only">
        <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.12em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Mes documents</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground">Mes CV</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Créez, modifiez et améliorez vos CV à votre rythme.</p>
      </div>

      <Button asChild className="mt-5 h-13 w-full rounded-2xl font-black shadow-lg shadow-primary/20"><Link href="/cv-builder"><FileText className="mr-2 h-5 w-5" />Créer un nouveau CV</Link></Button>

      <section className="mt-6 space-y-3">
        {cvs?.length ? cvs.map((cv) => (
          <Link key={cv.id} href={`/cv-editor?edit=${cv.id}`} className="block rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30 active:scale-[0.99]">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1"><span className="block truncate font-black text-foreground">{cv.titre || 'CV sans titre'}</span><span className="mt-1 block text-xs text-muted-foreground">Modèle {cv.template || 'moderne'} · Modifié {cv.updated_at ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date(cv.updated_at)) : 'récemment'}</span></span>
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
          </Link>
        )) : (
          <Card className="border-dashed border-2 shadow-sm"><CardContent className="flex flex-col items-center px-6 py-14 text-center"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><FileText className="h-7 w-7" /></span><h2 className="mt-5 text-lg font-black text-foreground">Votre premier CV commence ici</h2><p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">Choisissez un modèle et remplissez vos informations en quelques minutes.</p><Button asChild className="mt-6 rounded-xl"><Link href="/cv-builder">Créer mon premier CV <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></CardContent></Card>
        )}
      </section>
    </div>
  )
}
