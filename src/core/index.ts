import { isAdmin } from './admin'
import { metrics } from './metrics'
import * as Chan from './chan'
import * as Blacklist from './blacklist'
import * as Whitelist from './whitelist'
import * as JsonSchema from './json-schema'
import { TBAC } from './token-based-access-control'

export const Core: ICore = {
  isAdmin
, metrics
, Chan
, Blacklist
, Whitelist
, JsonSchema
, TBAC
}
