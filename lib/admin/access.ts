export const ADMIN_EMAILS = ['nokejoel@gmail.com', 'jojoolf@gmail.com'] as const

export function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && ADMIN_EMAILS.includes(email as (typeof ADMIN_EMAILS)[number]))
}
