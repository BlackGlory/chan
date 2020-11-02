import { Forbidden, Unauthorized } from './error'
import { AccessControlDAO } from '@dao'
import { TOKEN_BASED_ACCESS_CONTROL, TOKEN_REQUIRED } from '@env'

export function isEnabled() {
  return TOKEN_BASED_ACCESS_CONTROL()
}

export function getAllIds(): Promise<string[]> {
  return AccessControlDAO.getAllIdsWithTokens()
}

export function getTokens(id: string): Promise<Array<{
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

export async function checkWritePermission(id: string, token?: string) {
  if (!isEnabled()) return

  if (TOKEN_REQUIRED()) {
    if (!await AccessControlDAO.hasWriteTokens(id) && !await AccessControlDAO.hasReadTokens(id)) {
      throw new Forbidden()
    }
  }

  if (await AccessControlDAO.hasWriteTokens(id)) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchWriteToken({ token, id })) throw new Unauthorized()
  }
}

export function setReadToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.setReadToken({ id, token })
}

export function unsetReadToken(id: string, token: string): Promise<void> {
  return AccessControlDAO.unsetReadToken({ id, token })
}

export async function checkReadPermission(id: string, token?: string) {
  if (!isEnabled()) return

  if (TOKEN_REQUIRED()) {
    if (!await AccessControlDAO.hasWriteTokens(id) && !await AccessControlDAO.hasReadTokens(id)) {
      throw new Forbidden()
    }
  }

  if (await AccessControlDAO.hasReadTokens(id)) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchReadToken({ token, id })) throw new Unauthorized()
  }
}
