import { AccessControlDAO } from '@dao'

export function getAllIds(): Promise<string[]> {
  return AccessControlDAO.getAllIdsWithTokenPolicies()
}

export function get(id: string): Promise<{
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
}> {
  return AccessControlDAO.getTokenPolicies(id)
}

export function setWriteTokenRequired(id: string, val: boolean): Promise<void> {
  return AccessControlDAO.setWriteTokenRequired(id, val)
}

export function unsetWriteTokenRequired(id: string): Promise<void> {
  return AccessControlDAO.unsetWriteTokenRequired(id)
}

export function setReadTokenRequired(id: string, val: boolean): Promise<void> {
  return AccessControlDAO.setReadTokenRequired(id, val)
}

export function unsetReadTokenRequired(id: string): Promise<void> {
  return AccessControlDAO.unsetReadTokenRequired(id)
}
