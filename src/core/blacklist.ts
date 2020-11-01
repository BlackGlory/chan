import { AccessControlDAO } from '@dao'
import { LIST_BASED_ACCESS_CONTROL, ListBasedAccessControl } from '@env'
import { Forbidden } from './error'

export function getAll(): Promise<string[]> {
  return AccessControlDAO.getAllBlacklistItems()
}

export function add(id: string): Promise<void> {
  return AccessControlDAO.addBlacklistItem(id)
}

export function remove(id: string): Promise<void> {
  return AccessControlDAO.removeBlacklistItem(id)
}

export function isEnabled(): boolean {
  return LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Blacklist
}

export async function isBlocked(id: string): Promise<boolean> {
  return await AccessControlDAO.inBlacklist(id)
}

export async function check(id: string): Promise<void> {
  if (isEnabled() && await isBlocked(id)) throw new Forbidden()
}
