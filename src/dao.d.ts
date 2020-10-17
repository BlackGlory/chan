interface BlacklistDAO {
  getAllBlacklistItems(): Promise<string[]>
  inBlacklist(id: string): Promise<boolean>
  addBlacklistItem(id: string): Promise<void>
  removeBlacklistItem(id: string): Promise<void>
}

interface WhitelistDAO {
  getAllWhitelistItems(): Promise<string[]>
  inWhitelist(id: string): Promise<boolean>
  addWhitelistItem(id: string): Promise<void>
  removeWhitelistItem(id: string): Promise<void>
}

interface JsonSchemaDAO {
  getAllIdsWithJsonSchema(): Promise<string[]>
  getJsonSchema(id: string): Promise<string | null>
  setJsonSchema(props: { id: string; schema: string }): Promise<void>
  removeJsonSchema(id: string): Promise<void>
}

interface TokenBasedAccessControlDAO {
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

interface DataAccessObject extends BlacklistDAO
                                 , WhitelistDAO
                                 , JsonSchemaDAO
                                 , TokenBasedAccessControlDAO {}
