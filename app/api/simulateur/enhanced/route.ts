import { NextResponse } from 'next/server'
import { startEnhancedSimulation, sendEnhancedMessage } from '@/app/dashboard/simulateur/actions'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (!action) {
      return NextResponse.json({ success: false, error: "L'action est requise." }, { status: 400 })
    }

    if (action === 'start') {
      const { cvId, poste, sector, interviewType, nombreQuestions } = data
      const result = await startEnhancedSimulation({
        cvId,
        poste,
        sector,
        interviewType,
        nombreQuestions
      })
      return NextResponse.json(result)
    }

    if (action === 'message') {
      const { id, message, history } = data
      const result = await sendEnhancedMessage(id, message, history)
      return NextResponse.json(result)
    }

    return NextResponse.json({ success: false, error: "Action non prise en charge." }, { status: 400 })
  } catch (error: any) {
    console.error("Erreur API simulateur enhanced:", error)
    return NextResponse.json({ success: false, error: error.message || "Erreur serveur." }, { status: 500 })
  }
}
