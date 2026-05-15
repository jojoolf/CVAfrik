import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import FedaPay from 'fedapay';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // On vérifie que c'est bien une transaction approuvée
    if (body.event === 'transaction.approved') {
      const transaction = body.entity;
      const customer = transaction.customer;
      const description = transaction.description; // Contient le nom du plan
      
      // Extraire le planId de la description (ex: "Abonnement CVAfrik - Plan pro")
      const planId = description.toLowerCase().includes('pro') ? 'pro' : 
                     description.toLowerCase().includes('business') ? 'business' : 'starter';

      const supabase = await createClient();

      // 1. Trouver l'utilisateur par son email
      const { data: profile, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', customer.email)
        .single();

      if (userError || !profile) {
        console.error('User not found for email:', customer.email);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // 2. Mettre à jour son plan et sa date d'expiration (30 jours)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          plan: planId,
          plan_expiry: expiryDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error('Update profile error:', updateError);
        return NextResponse.json({ error: 'Update failed' }, { status: 500 });
      }

      console.log(`Plan ${planId} activé automatiquement pour ${customer.email}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
