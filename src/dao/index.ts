import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import * as TokenBasedAccessControl from './token-based-access-control'

const BlacklistDAO: BlacklistDAO = {
  addBlacklistItem: asyncify(Blacklist.addBlacklistItem)
, getAllBlacklistItems: asyncify(Blacklist.getAllBlacklistItems)
, inBlacklist: asyncify(Blacklist.inBlacklist)
, removeBlacklistItem: asyncify(Blacklist.removeBlacklistItem)
}

const WhitelistDAO: WhitelistDAO = {
  addWhitelistItem: asyncify(Whitelist.addWhitelistItem)
, getAllWhitelistItems: asyncify(Whitelist.getAllWhitelistItems)
, inWhitelist: asyncify(Whitelist.inWhitelist)
, removeWhitelistItem: asyncify(Whitelist.removeWhitelistItem)
}

const JsonSchemaDAO: JsonSchemaDAO = {
  getAllIdsWithJsonSchema: asyncify(JsonSchema.getAllIdsWithJsonSchema)
, getJsonSchema: asyncify(JsonSchema.getJsonSchema)
, removeJsonSchema: asyncify(JsonSchema.removeJsonSchema)
, setJsonSchema: asyncify(JsonSchema.setJsonSchema)
}

const TokenBasedAccessControlDAO: TokenBasedAccessControlDAO = {
  getAllIdsWithTokens: asyncify(TokenBasedAccessControl.getAllIdsWithTokens)
, getAllTokens: asyncify(TokenBasedAccessControl.getAllTokens)

, hasEnqueueTokens: asyncify(TokenBasedAccessControl.hasEnqueueTokens)
, matchEnqueueToken: asyncify(TokenBasedAccessControl.matchEnqueueToken)
, setEnqueueToken: asyncify(TokenBasedAccessControl.setEnqueueToken)
, unsetEnqueueToken: asyncify(TokenBasedAccessControl.unsetEnqueueToken)

, hasDequeueTokens: asyncify(TokenBasedAccessControl.hasDequeueTokens)
, matchDequeueToken: asyncify(TokenBasedAccessControl.matchDequeueToken)
, setDequeueToken: asyncify(TokenBasedAccessControl.setDequeueToken)
, unsetDequeueToken: asyncify(TokenBasedAccessControl.unsetDequeueToken)
}

const DAO: DataAccessObject = {
  ...BlacklistDAO
, ...WhitelistDAO
, ...JsonSchemaDAO
, ...TokenBasedAccessControlDAO
}

export default DAO

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
