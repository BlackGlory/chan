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

interface IJsonSchemaDAO {
  getAllIdsWithJsonSchema(): Promise<string[]>
  getJsonSchema(id: string): Promise<string | null>
  setJsonSchema(props: { id: string; schema: string }): Promise<void>
  removeJsonSchema(id: string): Promise<void>
}

interface ITokenBasedAccessControlDAO {
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

interface IConfigDAO extends
  IBlacklistDAO
, IWhitelistDAO
, IJsonSchemaDAO
, ITokenBasedAccessControlDAO {}
