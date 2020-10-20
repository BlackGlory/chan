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
    enqueue: boolean
    dequeue: boolean
  }>>

  hasEnqueueTokens(id: string): Promise<boolean>
  matchEnqueueToken(props: { token: string; id: string }): Promise<boolean>
  setEnqueueToken(props: { token: string; id: string }): Promise<void>
  unsetEnqueueToken(props: { token: string; id: string }): Promise<void>

  hasDequeueTokens(id: string): Promise<boolean>
  matchDequeueToken(props: { token: string; id: string }): Promise<boolean>
  setDequeueToken(props: { token: string; id: string }): Promise<void>
  unsetDequeueToken(props: { token: string; id: string }): Promise<void>
}

interface IDataAccessObject extends IBlacklistDAO
                                  , IWhitelistDAO
                                  , IJsonSchemaDAO
                                  , ITokenBasedAccessControlDAO {}
