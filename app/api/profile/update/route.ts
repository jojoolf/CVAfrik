import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'nodejs'

const MAX_AVATAR_SIZE = 5 * 1024 * 1024
const ACCEPTED_AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function textValue(formData: FormData, key: string, maxLength: number) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  try {
    const sessionClient = await createClient()
    const { data: { user } } = await sessionClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Veuillez vous connecter pour modifier votre profil.' }, { status: 401 })
    }

    const formData = await request.formData()
    const avatar = formData.get('avatar')
    const removeAvatar = formData.get('removeAvatar') === 'true'
    const admin = createAdminClient()

    const { data: existingProfile, error: existingError } = await admin
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .maybeSingle()

    if (existingError) throw existingError

    let avatarUrl = existingProfile?.avatar_url || null

    if (avatar instanceof File && avatar.size > 0) {
      if (!ACCEPTED_AVATAR_TYPES.has(avatar.type)) {
        return NextResponse.json({ error: 'Format de photo non pris en charge. Utilisez JPG, PNG ou WEBP.' }, { status: 400 })
      }
      if (avatar.size > MAX_AVATAR_SIZE) {
        return NextResponse.json({ error: 'La photo ne doit pas dépasser 5 Mo.' }, { status: 400 })
      }

      const extension = avatar.type === 'image/png' ? 'png' : avatar.type === 'image/webp' ? 'webp' : 'jpg'
      const path = `${user.id}/profile.${extension}`
      const { error: uploadError } = await admin.storage.from('avatars').upload(path, avatar, {
        cacheControl: '3600',
        contentType: avatar.type,
        upsert: true,
      })
      if (uploadError) throw uploadError

      const { data: publicUrl } = admin.storage.from('avatars').getPublicUrl(path)
      avatarUrl = `${publicUrl.publicUrl}?v=${Date.now()}`
    } else if (removeAvatar) {
      avatarUrl = null
    }

    const profilePayload = {
      id: user.id,
      email: user.email || '',
      prenom: textValue(formData, 'prenom', 120),
      nom: textValue(formData, 'nom', 120),
      date_naissance: textValue(formData, 'date_naissance', 20) || null,
      telephone: textValue(formData, 'telephone', 40),
      adresse: textValue(formData, 'adresse', 240),
      pays: textValue(formData, 'pays', 12),
      linkedin: textValue(formData, 'linkedin', 300),
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    }

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select('id, avatar_url, updated_at')
      .single()

    if (profileError) throw profileError

    const metadataResult = await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        avatar_url: profile.avatar_url,
        prenom: profilePayload.prenom,
        nom: profilePayload.nom,
        full_name: `${profilePayload.prenom} ${profilePayload.nom}`.trim(),
      },
    })
    if (metadataResult.error) throw metadataResult.error

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile update API error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Impossible d’enregistrer le profil.' }, { status: 500 })
  }
}
