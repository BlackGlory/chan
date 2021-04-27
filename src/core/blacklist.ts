import { AccessControlDAO } from '@dao'
import { LIST_BASED_ACCESS_CONTROL, ListBasedAccessControl } from '@env'
import { CustomError } from '@blackglory/errors'

export function getAll(): Promise<string[]> {
  return AccessControlDAO.getAllBlacklistItems()
}

export function add(namespace: string): Promise<void> {
  return AccessControlDAO.addBlacklistItem(namespace)
}

export function remove(namespace: string): Promise<void> {
  return AccessControlDAO.removeBlacklistItem(namespace)
}

export function isEnabled(): boolean {
  return LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Blacklist
}

export async function isBlocked(namespace: string): Promise<boolean> {
  return await AccessControlDAO.inBlacklist(namespace)
}

/**
 * @throws {Forbidden}
 */
export async function check(namespace: string): Promise<void> {
  if (isEnabled() && await isBlocked(namespace)) throw new Forbidden()
}

export class Forbidden extends CustomError {}
