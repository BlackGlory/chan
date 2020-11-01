import { Forbidden, Unauthorized } from './error'
import { ConfigDAO } from '@dao'
import { TOKEN_BASED_ACCESS_CONTROL, DISABLE_NO_TOKENS } from '@env'

export function isEnabled() {
  return TOKEN_BASED_ACCESS_CONTROL()
}

export function getAllIds(): Promise<string[]> {
  return ConfigDAO.getAllIdsWithTokens()
}

export function getTokens(id: string): Promise<Array<{
  token: string
  write: boolean
  read: boolean
}>> {
  return ConfigDAO.getAllTokens(id)
}

export function setWriteToken(id: string, token: string): Promise<void> {
  return ConfigDAO.setWriteToken({ id, token })
}

export function unsetWriteToken(id: string, token: string): Promise<void> {
  return ConfigDAO.unsetWriteToken({ id, token })
}

export async function checkWritePermission(id: string, token?: string) {
  if (DISABLE_NO_TOKENS()) {
    if (!await ConfigDAO.hasWriteTokens(id) && !await ConfigDAO.hasReadTokens(id)) {
      throw new Forbidden()
    }
  }

  if (await ConfigDAO.hasWriteTokens(id)) {
    if (!token) throw new Unauthorized()
    if (!await ConfigDAO.matchWriteToken({ token, id })) throw new Unauthorized()
  }
}

export function setReadToken(id: string, token: string): Promise<void> {
  return ConfigDAO.setReadToken({ id, token })
}

export function unsetReadToken(id: string, token: string): Promise<void> {
  return ConfigDAO.unsetReadToken({ id, token })
}

export async function checkReadPermission(id: string, token?: string) {
  if (DISABLE_NO_TOKENS()) {
    if (!await ConfigDAO.hasWriteTokens(id) && !await ConfigDAO.hasReadTokens(id)) {
      throw new Forbidden()
    }
  }

  if (await ConfigDAO.hasReadTokens(id)) {
    if (!token) throw new Unauthorized()
    if (!await ConfigDAO.matchReadToken({ token, id })) throw new Unauthorized()
  }
}
