import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as Token from './token'
import * as TokenPolicy from './token-policy'

const BlacklistDAO: IBlacklistDAO = {
  addBlacklistItem: asyncify(Blacklist.addBlacklistItem)
, getAllBlacklistItems: asyncify(Blacklist.getAllBlacklistItems)
, inBlacklist: asyncify(Blacklist.inBlacklist)
, removeBlacklistItem: asyncify(Blacklist.removeBlacklistItem)
}

const WhitelistDAO: IWhitelistDAO = {
  addWhitelistItem: asyncify(Whitelist.addWhitelistItem)
, getAllWhitelistItems: asyncify(Whitelist.getAllWhitelistItems)
, inWhitelist: asyncify(Whitelist.inWhitelist)
, removeWhitelistItem: asyncify(Whitelist.removeWhitelistItem)
}

const TokenDAO: ITokenDAO = {
  getAllNamespacesWithTokens: asyncify(Token.getAllIdsWithTokens)
, getAllTokens: asyncify(Token.getAllTokens)

, hasWriteTokens: asyncify(Token.hasWriteTokens)
, matchWriteToken: asyncify(Token.matchWriteToken)
, setWriteToken: asyncify(Token.setWriteToken)
, unsetWriteToken: asyncify(Token.unsetWriteToken)

, hasReadTokens: asyncify(Token.hasReadTokens)
, matchReadToken: asyncify(Token.matchReadToken)
, setReadToken: asyncify(Token.setReadToken)
, unsetReadToken: asyncify(Token.unsetReadToken)
}

const TokenPolicyDAO: ITokenPolicyDAO = {
  getAllNamespacesWithTokenPolicies: asyncify(TokenPolicy.getAllNamespacesWithTokenPolicies)
, getTokenPolicies: asyncify(TokenPolicy.getTokenPolicies)

, setWriteTokenRequired: asyncify(TokenPolicy.setWriteTokenRequired)
, unsetWriteTokenRequired: asyncify(TokenPolicy.unsetWriteTokenRequired)

, setReadTokenRequired: asyncify(TokenPolicy.setReadTokenRequired)
, unsetReadTokenRequired: asyncify(TokenPolicy.unsetReadTokenRequired)
}

export const AccessControlDAO: IAccessControlDAO = {
  ...BlacklistDAO
, ...WhitelistDAO
, ...TokenDAO
, ...TokenPolicyDAO
}

function asyncify<T extends any[], U>(fn: (...args: T) => U): (...args: T) => Promise<U> {
  return async function (this: unknown, ...args: T): Promise<U> {
    return Reflect.apply(fn, this, args)
  }
}
