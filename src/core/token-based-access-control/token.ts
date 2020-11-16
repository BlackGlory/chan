import { AccessControlDAO } from '@dao'

export function getAllIds(): Promise<string[]> {
  return AccessControlDAO.getAllIdsWithTokens()
}

export function getAll(id: string): Promise<Array<{
  token: string
  write: boolean
  read: boolean
}>> {
  return AccessControlDAO.getAllTokens(id)
}

export function setWriteToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.setWriteToken({ id, token })
}

export function unsetWriteToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.unsetWriteToken({ id, token })
}

export function setReadToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.setReadToken({ id, token })
}

export function unsetReadToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.unsetReadToken({ id, token })
}
