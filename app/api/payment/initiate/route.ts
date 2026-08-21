import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Cette route de paiement est désactivée. Utilisez FedaPay.' },
    { status: 410 },
  )
}
