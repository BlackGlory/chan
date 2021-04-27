import { AccessControlDAO } from '@dao'

export function getAllNamespaces(): Promise<string[]> {
  return AccessControlDAO.getAllNamespacesWithTokens()
}

export function getAll(namespace: string): Promise<Array<{
  token: string
  write: boolean
  read: boolean
}>> {
  return AccessControlDAO.getAllTokens(namespace)
}

export function setWriteToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.setWriteToken({ namespace, token })
}

export function unsetWriteToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.unsetWriteToken({ namespace, token })
}

export function setReadToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.setReadToken({ namespace, token })
}

export function unsetReadToken(namespace: string, token: string): Promise<void> {
  return AccessControlDAO.unsetReadToken({ namespace, token })
}
