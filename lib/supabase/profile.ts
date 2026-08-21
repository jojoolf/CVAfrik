export async function checkAndGetProfile(supabase: any, userId: string) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error || !profile) return profile

  // If the user is on a paid plan, check if the subscription has expired
  if (profile.plan !== 'gratuit' && profile.plan_expiry) {
    const expiry = new Date(profile.plan_expiry)
    const now = new Date()
    if (expiry < now) {
      // Plan has expired! Downgrade the plan in the database
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          plan: 'gratuit',
          plan_expiry: null,
          updated_at: now.toISOString()
        })
        .eq('id', userId)
        .select()
        .maybeSingle()

      if (!updateError && updatedProfile) {
        return updatedProfile
      }
      
      // Fallback: update local object if update failed or returned empty
      return {
        ...profile,
        plan: 'gratuit',
        plan_expiry: null
      }
    }
  }

  return profile
}
