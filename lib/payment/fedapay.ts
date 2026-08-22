import type { NextRequest } from 'next/server'

export type FedaPayEnvironment = 'sandbox' | 'live'
export type FedaPayBilling = 'monthly' | 'annual'

export function getFedaPayEnvironment(): FedaPayEnvironment {
  const configured = process.env.FEDAPAY_ENV?.trim().toLowerCase()
  if (configured === 'live' || configured === 'sandbox') {
    return configured
  }

  // Vercel production should use the live API unless explicitly overridden.
  return process.env.VERCEL_ENV === 'production' ? 'live' : 'sandbox'
}

export function getFedaPayApiBaseUrl(): string {
  return getFedaPayEnvironment() === 'live'
    ? 'https://api.fedapay.com/v1'
    : 'https://sandbox-api.fedapay.com/v1'
}

export function getFedaPaySecretKey(): string {
  return process.env.FEDAPAY_SECRET_KEY?.trim() || ''
}

export function getAppOrigin(request?: NextRequest | Request): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (explicit) {
    return explicit.replace(/\/+$/, '')
  }

  if (request) {
    return new URL(request.url).origin
  }

  return 'http://localhost:3000'
}

export function buildFedaPayPaymentCallbackUrl(request?: NextRequest | Request): string {
  return `${getAppOrigin(request)}/paiement/success`
}

export function getPlanExpiryDate(billing: FedaPayBilling): Date {
  const expiry = new Date()
  expiry.setMonth(expiry.getMonth() + (billing === 'annual' ? 12 : 1))
  return expiry
}

export function getPlanExpiryDateFromDuration(durationId?: string | null, billing?: FedaPayBilling): Date {
  const expiry = new Date()
  const normalized = durationId?.trim().toLowerCase()

  switch (normalized) {
    case '15j':
      expiry.setDate(expiry.getDate() + 15)
      return expiry
    case '1m':
      expiry.setMonth(expiry.getMonth() + 1)
      return expiry
    case '3m':
      expiry.setMonth(expiry.getMonth() + 3)
      return expiry
    case '6m':
      expiry.setMonth(expiry.getMonth() + 6)
      return expiry
    case '1y':
    case 'annual':
      expiry.setFullYear(expiry.getFullYear() + 1)
      return expiry
    default:
      return getPlanExpiryDate(billing ?? 'monthly')
  }
}

export function parseFedaPayTransactionId(value: unknown): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value)
  }

  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  return null
}

export async function fetchFedaPayTransaction(transactionId: string | number) {
  const secretKey = getFedaPaySecretKey()
  if (!secretKey) {
    throw new Error('FEDAPAY_SECRET_KEY manquant')
  }

  const response = await fetch(`${getFedaPayApiBaseUrl()}/transactions/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      Accept: 'application/json',
    },
  })

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Impossible de verifier la transaction FedaPay')
  }

  return data
}

