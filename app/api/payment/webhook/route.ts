import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Ce webhook est désactivé. Utilisez le webhook FedaPay.' },
    { status: 410 },
  )
}
