import { Forbidden, Unauthorized } from '../error'
import {
  TOKEN_BASED_ACCESS_CONTROL
, READ_TOKEN_REQUIRED
, WRITE_TOKEN_REQUIRED
} from '@env'
import { AccessControlDAO } from '@dao'
import * as TokenPolicy from './token-policy'
import * as Token from './token'

export const TBAC: ICore['TBAC'] = {
  isEnabled
, checkWritePermission
, checkReadPermission
, TokenPolicy
, Token
}

export function isEnabled() {
  return TOKEN_BASED_ACCESS_CONTROL()
}

export async function checkWritePermission(id: string, token?: string) {
  if (!isEnabled()) return
  if (WRITE_TOKEN_REQUIRED() && !token) throw new Forbidden()

  if (await AccessControlDAO.hasWriteTokens(id)) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchWriteToken({ token, id })) throw new Unauthorized()
  }
}

export async function checkReadPermission(id: string, token?: string) {
  if (!isEnabled()) return
  if (READ_TOKEN_REQUIRED() && !token) throw new Forbidden()

  if (await AccessControlDAO.hasReadTokens(id)) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchReadToken({ token, id })) throw new Unauthorized()
  }
}
