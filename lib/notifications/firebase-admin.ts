import 'server-only'

import { cert, getApps, initializeApp, type App, type ServiceAccount } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

type FirebaseServiceAccount = ServiceAccount & {
  project_id?: string
  client_email?: string
  private_key?: string
}

function readServiceAccount(): FirebaseServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!raw) {
    throw new Error('La configuration Firebase de notifications est absente.')
  }

  try {
    const account = JSON.parse(raw) as FirebaseServiceAccount
    if (!account.project_id || !account.client_email || !account.private_key) {
      throw new Error('Configuration Firebase incomplète.')
    }
    return account
  } catch (error) {
    if (error instanceof Error && error.message === 'Configuration Firebase incomplète.') throw error
    throw new Error('La configuration Firebase de notifications est invalide.')
  }
}

function getFirebaseApp(): App {
  if (getApps().length > 0) return getApps()[0]
  return initializeApp({ credential: cert(readServiceAccount()) })
}

export function getFirebaseMessaging() {
  return getMessaging(getFirebaseApp())
}
