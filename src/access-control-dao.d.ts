interface IBlacklistDAO {
  getAllBlacklistItems(): Promise<string[]>
  inBlacklist(namespace: string): Promise<boolean>
  addBlacklistItem(namespace: string): Promise<void>
  removeBlacklistItem(namespace: string): Promise<void>
}

interface IWhitelistDAO {
  getAllWhitelistItems(): Promise<string[]>
  inWhitelist(namespace: string): Promise<boolean>
  addWhitelistItem(namespace: string): Promise<void>
  removeWhitelistItem(namespace: string): Promise<void>
}

interface ITokenDAO {
  getAllNamespacesWithTokens(): Promise<string[]>
  getAllTokens(namespace: string): Promise<Array<{
    token: string
    write: boolean
    read: boolean
  }>>

  hasWriteTokens(namespace: string): Promise<boolean>
  matchWriteToken(params: { token: string; namespace: string }): Promise<boolean>
  setWriteToken(params: { token: string; namespace: string }): Promise<void>
  unsetWriteToken(params: { token: string; namespace: string }): Promise<void>

  hasReadTokens(namespace: string): Promise<boolean>
  matchReadToken(params: { token: string; namespace: string }): Promise<boolean>
  setReadToken(params: { token: string; namespace: string }): Promise<void>
  unsetReadToken(params: { token: string; namespace: string }): Promise<void>
}

interface ITokenPolicyDAO {
  getAllNamespacesWithTokenPolicies(): Promise<string[]>
  getTokenPolicies(namespace: string): Promise<{
    writeTokenRequired: boolean | null
    readTokenRequired: boolean | null
  }>

  setWriteTokenRequired(namespace: string, val: boolean): Promise<void>
  unsetWriteTokenRequired(namespace: string): Promise<void>

  setReadTokenRequired(namespace: string, val: boolean): Promise<void>
  unsetReadTokenRequired(namespace: string): Promise<void>
}

interface IAccessControlDAO extends
  IBlacklistDAO
, IWhitelistDAO
, ITokenDAO
, ITokenPolicyDAO {}
