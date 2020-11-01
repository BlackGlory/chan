import { ADMIN_PASSWORD } from '@env'

export function isAdmin(password: string) {
  if (ADMIN_PASSWORD() && password === ADMIN_PASSWORD()) return true
  else return false
}
