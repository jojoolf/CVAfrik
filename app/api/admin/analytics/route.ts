import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin/access'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const MAX_COUNTRY_ROWS = 5_000

function startOfUtcDay(offsetDays = 0) {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + offsetDays)).toISOString()
}

function totalAmount(rows: Array<{ amount: number | string | null | undefined }> | null | undefined) {
  return (rows || []).reduce((total, row) => total + Number(row.amount || 0), 0)
}

async function requireAdmin() {
  const auth = await createClient()
  const { data: { user } } = await auth.auth.getUser()
  return isAdminEmail(user?.email) ? user : null
}

export async function GET() {
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 })

    const supabase = createAdminClient()
    const now = new Date()
    const todayStart = startOfUtcDay(0)
    const yesterdayStart = startOfUtcDay(-1)
    const tomorrowStart = startOfUtcDay(1)
    const dayAfterTomorrowStart = startOfUtcDay(2)
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()
    const onlineSince = new Date(now.getTime() - 75 * 1000).toISOString()

    const [
      totalProfilesResult,
      todayProfilesResult,
      yesterdayProfilesResult,
      paidProfilesResult,
      onlineResult,
      expiringTomorrowResult,
      expiringThisWeekResult,
      profilesByCountryResult,
      recentAccountsResult,
      newsletterResult,
      blogPostsResult,
      cvsResult,
      lettersResult,
      applicationsResult,
      autoTodayResult,
      autoYesterdayResult,
      autoMonthResult,
      manualTodayResult,
      manualYesterdayResult,
      manualMonthResult,
    ] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', todayStart),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('created_at', yesterdayStart).lt('created_at', todayStart),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).neq('plan', 'gratuit').or(`plan_expiry.is.null,plan_expiry.gt.${now.toISOString()}`),
      supabase.from('user_presence').select('user_id,country_code,platform,last_seen_at').gte('last_seen_at', onlineSince).order('last_seen_at', { ascending: false }),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).neq('plan', 'gratuit').gte('plan_expiry', tomorrowStart).lt('plan_expiry', dayAfterTomorrowStart),
      supabase.from('profiles').select('id', { count: 'exact', head: true }).neq('plan', 'gratuit').gte('plan_expiry', tomorrowStart).lt('plan_expiry', startOfUtcDay(8)),
      supabase.from('profiles').select('pays,last_seen_country').limit(MAX_COUNTRY_ROWS),
      supabase.from('profiles').select('id,email,prenom,nom,pays,plan,created_at,last_seen_at').order('created_at', { ascending: false }).limit(8),
      supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('publie', true),
      supabase.from('cvs').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
      supabase.from('lettres_motivation').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
      supabase.from('suivi_candidatures').select('id', { count: 'exact', head: true }).gte('created_at', monthStart),
      supabase.from('payments').select('montant_fcfa,created_at').eq('statut', 'accepte').gte('created_at', todayStart),
      supabase.from('payments').select('montant_fcfa,created_at').eq('statut', 'accepte').gte('created_at', yesterdayStart).lt('created_at', todayStart),
      supabase.from('payments').select('montant_fcfa,created_at').eq('statut', 'accepte').gte('created_at', monthStart),
      supabase.from('manual_payments').select('montant,validated_at').eq('statut', 'valide').gte('validated_at', todayStart),
      supabase.from('manual_payments').select('montant,validated_at').eq('statut', 'valide').gte('validated_at', yesterdayStart).lt('validated_at', todayStart),
      supabase.from('manual_payments').select('montant,validated_at').eq('statut', 'valide').gte('validated_at', monthStart),
    ])

    const errors = [
      totalProfilesResult.error, todayProfilesResult.error, yesterdayProfilesResult.error, paidProfilesResult.error,
      onlineResult.error, expiringTomorrowResult.error, expiringThisWeekResult.error, profilesByCountryResult.error,
      recentAccountsResult.error, newsletterResult.error, blogPostsResult.error, cvsResult.error, lettersResult.error,
      applicationsResult.error, autoTodayResult.error, autoYesterdayResult.error, autoMonthResult.error,
      manualTodayResult.error, manualYesterdayResult.error, manualMonthResult.error,
    ].filter(Boolean)
    if (errors.length) throw errors[0]

    const countryCounts = new Map<string, number>()
    for (const profile of profilesByCountryResult.data || []) {
      const country = (profile.pays || profile.last_seen_country || 'Non renseigné').toUpperCase()
      countryCounts.set(country, (countryCounts.get(country) || 0) + 1)
    }
    const countries = Array.from(countryCounts.entries())
      .map(([country, users]) => ({ country, users }))
      .sort((a, b) => b.users - a.users)
      .slice(0, 12)

    const onlineByCountry = new Map<string, number>()
    for (const presence of onlineResult.data || []) {
      const country = presence.country_code || 'Non renseigné'
      onlineByCountry.set(country, (onlineByCountry.get(country) || 0) + 1)
    }

    const autoToday = autoTodayResult.data || []
    const autoYesterday = autoYesterdayResult.data || []
    const manualToday = manualTodayResult.data || []
    const manualYesterday = manualYesterdayResult.data || []
    const todaySubscriptions = autoToday.length + manualToday.length
    const yesterdaySubscriptions = autoYesterday.length + manualYesterday.length
    const revenueToday = totalAmount(autoToday.map((row) => ({ amount: row.montant_fcfa }))) + totalAmount(manualToday.map((row) => ({ amount: row.montant })))
    const revenueYesterday = totalAmount(autoYesterday.map((row) => ({ amount: row.montant_fcfa }))) + totalAmount(manualYesterday.map((row) => ({ amount: row.montant })))
    const revenueMonth = totalAmount((autoMonthResult.data || []).map((row) => ({ amount: row.montant_fcfa }))) + totalAmount((manualMonthResult.data || []).map((row) => ({ amount: row.montant })))

    return NextResponse.json({
      generatedAt: now.toISOString(),
      refreshAfterSeconds: 15,
      accounts: {
        total: totalProfilesResult.count || 0,
        createdToday: todayProfilesResult.count || 0,
        createdYesterday: yesterdayProfilesResult.count || 0,
        paidActive: paidProfilesResult.count || 0,
        online: onlineResult.data?.length || 0,
      },
      subscriptions: {
        today: todaySubscriptions,
        yesterday: yesterdaySubscriptions,
        expiringTomorrow: expiringTomorrowResult.count || 0,
        expiringNext7Days: expiringThisWeekResult.count || 0,
      },
      revenue: {
        today: revenueToday,
        yesterday: revenueYesterday,
        thisMonth: revenueMonth,
      },
      audience: {
        newsletterSubscribers: newsletterResult.count || 0,
        newsletterOpenTracking: 'À connecter à Resend',
        blogPostsPublished: blogPostsResult.count || 0,
        blogViewTracking: 'À instrumenter',
      },
      production: {
        cvsThisMonth: cvsResult.count || 0,
        lettersThisMonth: lettersResult.count || 0,
        applicationsThisMonth: applicationsResult.count || 0,
      },
      countries,
      onlineByCountry: Array.from(onlineByCountry.entries()).map(([country, users]) => ({ country, users })).sort((a, b) => b.users - a.users),
      recentAccounts: recentAccountsResult.data || [],
    })
  } catch (error) {
    console.error('[admin/analytics]', error)
    return NextResponse.json({ error: 'Les données analytiques sont indisponibles.' }, { status: 500 })
  }
}
