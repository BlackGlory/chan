interface IBlacklistDAO {
  getAllBlacklistItems(): Promise<string[]>
  inBlacklist(id: string): Promise<boolean>
  addBlacklistItem(id: string): Promise<void>
  removeBlacklistItem(id: string): Promise<void>
}

interface IWhitelistDAO {
  getAllWhitelistItems(): Promise<string[]>
  inWhitelist(id: string): Promise<boolean>
  addWhitelistItem(id: string): Promise<void>
  removeWhitelistItem(id: string): Promise<void>
}

interface ITokenDAO {
  getAllIdsWithTokens(): Promise<string[]>
  getAllTokens(id: string): Promise<Array<{
    token: string
    write: boolean
    read: boolean
  }>>

  hasWriteTokens(id: string): Promise<boolean>
  matchWriteToken(props: { token: string; id: string }): Promise<boolean>
  setWriteToken(props: { token: string; id: string }): Promise<void>
  unsetWriteToken(props: { token: string; id: string }): Promise<void>

  hasReadTokens(id: string): Promise<boolean>
  matchReadToken(props: { token: string; id: string }): Promise<boolean>
  setReadToken(props: { token: string; id: string }): Promise<void>
  unsetReadToken(props: { token: string; id: string }): Promise<void>
}

interface ITokenPolicyDAO {
  getAllIdsWithTokenPolicies(): Promise<string[]>
  getTokenPolicies(id: string): Promise<{
    writeTokenRequired: boolean | null
    readTokenRequired: boolean | null
  }>

  setWriteTokenRequired(id: string, val: boolean): Promise<void>
  unsetWriteTokenRequired(id: string): Promise<void>

  setReadTokenRequired(id: string, val: boolean): Promise<void>
  unsetReadTokenRequired(id: string): Promise<void>
}

interface IAccessControlDAO extends
  IBlacklistDAO
, IWhitelistDAO
, ITokenDAO
, ITokenPolicyDAO {}
