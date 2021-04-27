import { AccessControlDAO } from '@dao'
import { LIST_BASED_ACCESS_CONTROL, ListBasedAccessControl } from '@env'
import { CustomError } from '@blackglory/errors'

export function getAll(): Promise<string[]> {
  return AccessControlDAO.getAllWhitelistItems()
}

export function add(namespace: string): Promise<void> {
  return AccessControlDAO.addWhitelistItem(namespace)
}

export function remove(namespace: string): Promise<void> {
  return AccessControlDAO.removeWhitelistItem(namespace)
}

export async function isBlocked(namespace: string): Promise<boolean> {
  return !await AccessControlDAO.inWhitelist(namespace)
}

export function isEnabled() {
  return LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Whitelist
}

/**
 * @throws {Forbidden}
 */
export async function check(namespace: string): Promise<void> {
  if (isEnabled() && await isBlocked(namespace)) throw new Forbidden()
}

export class Forbidden extends CustomError {}
