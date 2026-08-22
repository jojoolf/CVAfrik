import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createAuthClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin/access'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await createAuthClient()
    const { data: { user } } = await auth.auth.getUser()

    if (!isAdminEmail(user?.email)) {
      return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: 'Identifiant d’article manquant.' }, { status: 400 })
    }

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data: post, error: findError } = await supabase
      .from('blog_posts')
      .select('id, titre')
      .eq('id', id)
      .maybeSingle()

    if (findError) throw findError
    if (!post) {
      return NextResponse.json({ error: 'Article introuvable.' }, { status: 404 })
    }

    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    await supabase.from('admin_logs').insert({
      admin_email: user!.email!,
      action: 'article_supprime',
      details: { post_id: post.id, titre: post.titre },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/posts/delete]', error)
    return NextResponse.json(
      { error: 'La suppression a échoué. Réessaie dans quelques instants.' },
      { status: 500 },
    )
  }
}
