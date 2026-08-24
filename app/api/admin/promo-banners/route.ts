import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin/access'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

function isSafeInternalPath(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
}

function isSafeImageSource(value: unknown): value is string {
  if (typeof value !== 'string' || !value.trim()) return false
  try {
    const url = new URL(value, 'https://cv-afrik.vercel.app')
    return url.protocol === 'https:' || (url.origin === 'https://cv-afrik.vercel.app' && url.pathname.startsWith('/'))
  } catch {
    return false
  }
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 72)
}

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return isAdminEmail(user?.email) ? user : null
}

function getBannerInput(raw: Record<string, unknown>) {
  const title = typeof raw.title === 'string' ? raw.title.trim().slice(0, 90) : ''
  const body = typeof raw.body === 'string' ? raw.body.trim().slice(0, 240) : ''
  const imageUrl = typeof raw.image_url === 'string' ? raw.image_url.trim().slice(0, 1_500) : ''
  const actionLabel = typeof raw.action_label === 'string' ? raw.action_label.trim().slice(0, 48) : 'Découvrir'
  const actionHref = isSafeInternalPath(raw.action_href) ? raw.action_href.slice(0, 500) : ''
  const position = typeof raw.position === 'number' && Number.isInteger(raw.position) && raw.position >= 0 ? raw.position : 100
  const startsAt = typeof raw.starts_at === 'string' && !Number.isNaN(Date.parse(raw.starts_at)) ? new Date(raw.starts_at).toISOString() : new Date().toISOString()
  const endsAt = typeof raw.ends_at === 'string' && raw.ends_at && !Number.isNaN(Date.parse(raw.ends_at)) ? new Date(raw.ends_at).toISOString() : null
  const isActive = raw.is_active !== false
  const slugSource = typeof raw.slug === 'string' ? raw.slug : title
  const slug = slugify(slugSource)

  if (!title || !body || !imageUrl || !actionHref || !slug || !isSafeImageSource(imageUrl)) return { error: 'Titre, texte, visuel et lien interne valide sont obligatoires.' } as const
  if (endsAt && new Date(endsAt) <= new Date(startsAt)) return { error: 'La date de fin doit être postérieure à la date de début.' } as const

  return { value: { slug, title, body, image_url: imageUrl, action_label: actionLabel || 'Découvrir', action_href: actionHref, position, is_active: isActive, starts_at: startsAt, ends_at: endsAt } } as const
}

export async function GET() {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    const admin = createAdminClient()
    const { data, error } = await admin.from('native_promo_banners').select('*').order('position', { ascending: true }).order('created_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ banners: data || [] })
  } catch (error) {
    console.error('[admin/promo-banners/get]', error)
    return NextResponse.json({ error: 'Impossible de charger les bannières. Vérifie que la migration Supabase a été exécutée.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    const input = getBannerInput(await request.json())
    if ('error' in input) return NextResponse.json(input, { status: 400 })

    const admin = createAdminClient()
    const { data, error } = await admin.from('native_promo_banners').insert({ ...input.value, created_by: user.id }).select('*').single()
    if (error) throw error
    await admin.from('admin_logs').insert({ admin_email: user.email!, action: 'banniere_apk_creee', details: { banner_id: data.id, title: data.title, is_active: data.is_active } })
    return NextResponse.json({ banner: data }, { status: 201 })
  } catch (error) {
    console.error('[admin/promo-banners/post]', error)
    return NextResponse.json({ error: 'Création impossible. Vérifie le visuel, le lien et la migration Supabase.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    const raw = await request.json() as Record<string, unknown>
    const id = typeof raw.id === 'string' ? raw.id : ''
    if (!id) return NextResponse.json({ error: 'Bannière invalide.' }, { status: 400 })
    const input = getBannerInput(raw)
    if ('error' in input) return NextResponse.json(input, { status: 400 })

    const admin = createAdminClient()
    const { data, error } = await admin.from('native_promo_banners').update({ ...input.value, updated_at: new Date().toISOString() }).eq('id', id).select('*').single()
    if (error) throw error
    await admin.from('admin_logs').insert({ admin_email: user.email!, action: 'banniere_apk_modifiee', details: { banner_id: data.id, title: data.title, is_active: data.is_active } })
    return NextResponse.json({ banner: data })
  } catch (error) {
    console.error('[admin/promo-banners/patch]', error)
    return NextResponse.json({ error: 'Mise à jour impossible.' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })
    const raw = await request.json() as Record<string, unknown>
    const id = typeof raw.id === 'string' ? raw.id : ''
    if (!id) return NextResponse.json({ error: 'Bannière invalide.' }, { status: 400 })

    const admin = createAdminClient()
    const { error } = await admin.from('native_promo_banners').delete().eq('id', id)
    if (error) throw error
    await admin.from('admin_logs').insert({ admin_email: user.email!, action: 'banniere_apk_supprimee', details: { banner_id: id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[admin/promo-banners/delete]', error)
    return NextResponse.json({ error: 'Suppression impossible.' }, { status: 500 })
  }
}
