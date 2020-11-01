import { AccessControlDAO } from '@dao'
import { LIST_BASED_ACCESS_CONTROL, ListBasedAccessControl } from '@env'
import { Forbidden } from './error'

export function getAll(): Promise<string[]> {
  return AccessControlDAO.getAllWhitelistItems()
}

export function add(id: string): Promise<void> {
  return AccessControlDAO.addWhitelistItem(id)
}

export function remove(id: string): Promise<void> {
  return AccessControlDAO.removeWhitelistItem(id)
}

export async function isBlocked(id: string): Promise<boolean> {
  return !await AccessControlDAO.inWhitelist(id)
}

export function isEnabled() {
  return LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Whitelist
}

export async function check(id: string): Promise<void> {
  if (isEnabled() && await isBlocked(id)) throw new Forbidden()
}
