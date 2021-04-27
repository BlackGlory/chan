import { AccessControlDAO } from '@dao'

export function getAllNamespaces(): Promise<string[]> {
  return AccessControlDAO.getAllNamespacesWithTokenPolicies()
}

export function get(namespace: string): Promise<{
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
}> {
  return AccessControlDAO.getTokenPolicies(namespace)
}

export function setWriteTokenRequired(namespace: string, val: boolean): Promise<void> {
  return AccessControlDAO.setWriteTokenRequired(namespace, val)
}

export function unsetWriteTokenRequired(namespace: string): Promise<void> {
  return AccessControlDAO.unsetWriteTokenRequired(namespace)
}

export function setReadTokenRequired(namespace: string, val: boolean): Promise<void> {
  return AccessControlDAO.setReadTokenRequired(namespace, val)
}

export function unsetReadTokenRequired(namespace: string): Promise<void> {
  return AccessControlDAO.unsetReadTokenRequired(namespace)
}
