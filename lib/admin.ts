const ADMIN_EMAILS = ['nokejoel@gmail.com', 'jojoolf@gmail.com']

export function isAdminEmail(email: string | null | undefined) {
  return !!email && ADMIN_EMAILS.includes(email)
}

export { ADMIN_EMAILS }
