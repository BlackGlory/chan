import { CustomError } from '@blackglory/errors'
import {
  TOKEN_BASED_ACCESS_CONTROL
, READ_TOKEN_REQUIRED
, WRITE_TOKEN_REQUIRED
} from '@env'
import { AccessControlDAO } from '@dao'
import * as TokenPolicy from './token-policy'
import * as Token from './token'

class Unauthorized extends CustomError {}

export const TBAC: ICore['TBAC'] = {
  isEnabled
, checkWritePermission
, checkReadPermission
, Unauthorized

, TokenPolicy
, Token
}

function isEnabled() {
  return TOKEN_BASED_ACCESS_CONTROL()
}

/**
 * @throws {Unauthorized}
 */
async function checkWritePermission(namespace: string, token?: string) {
  if (!isEnabled()) return

  const writeTokenRequired =
    (await TokenPolicy.get(namespace)).writeTokenRequired
  ?? WRITE_TOKEN_REQUIRED()

  if (writeTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchWriteToken({ token, namespace })) {
      throw new Unauthorized()
    }
  }
}

/**
 * @throws {Unauthorized}
 */
async function checkReadPermission(namespace: string, token?: string) {
  if (!isEnabled()) return

  const readTokenRequired =
    (await TokenPolicy.get(namespace)).readTokenRequired
  ?? READ_TOKEN_REQUIRED()

  if (readTokenRequired) {
    if (!token) throw new Unauthorized()
    if (!await AccessControlDAO.matchReadToken({ token, namespace })) {
      throw new Unauthorized()
    }
  }
}
