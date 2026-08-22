import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient as createAuthClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/admin/access'

function createSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(request: Request) {
  try {
    const auth = await createAuthClient()
    const { data: { user } } = await auth.auth.getUser()

    if (!isAdminEmail(user?.email)) {
      return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    }

    const body = await request.json()
    const titre = String(body.titre || '').trim()
    const contenu = String(body.contenu || '').trim()
    const categorie = String(body.categorie || 'conseils')
    const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl : null
    const publie = Boolean(body.publie)

    if (!titre || !contenu) {
      return NextResponse.json({ error: 'Le titre et le contenu sont obligatoires.' }, { status: 400 })
    }

    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const slug = `${createSlug(titre)}-${Date.now().toString(36)}`

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        titre,
        slug,
        contenu,
        image_url: imageUrl || null,
        categorie,
        publie,
      })
      .select('id, slug, titre, categorie, publie')
      .single()

    if (error) throw error

    await supabase.from('admin_logs').insert({
      admin_email: user!.email!,
      action: 'article_cree',
      details: { post_id: post.id, titre: post.titre, categorie: post.categorie, publie: post.publie },
    })

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('[admin/posts/create]', error)
    return NextResponse.json(
      { error: 'La publication a échoué. Réessaie dans quelques instants.' },
      { status: 500 },
    )
  }
}
