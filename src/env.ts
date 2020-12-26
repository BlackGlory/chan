import { memoize } from 'lodash'
import * as env from 'env-var'
import { Getter } from '@blackglory/types'

export enum ListBasedAccessControl {
  Disable
, Whitelist
, Blacklist
}

export enum NodeEnv {
  Test
, Development
, Production
}

export const NODE_ENV: Getter<NodeEnv | undefined> = memoize(() => {
  const val = env.get('NODE_ENV')
                 .asEnum(['test', 'development', 'production'])

  switch (val) {
    case 'test': return NodeEnv.Test
    case 'development': return NodeEnv.Development
    case 'production': return NodeEnv.Production
  }
})

export const CI: Getter<boolean> = memoize(() =>
  env.get('CI')
     .default('false')
     .asBoolStrict()
)

export const HOST: Getter<string> = memoize(() =>
  env.get('CHAN_HOST')
     .default('localhost')
     .asString()
)

export const PORT: Getter<number> = memoize(() =>
  env.get('CHAN_PORT')
     .default(8080)
     .asPortNumber()
)

export const HTTP2: Getter<boolean> = memoize(() =>
  env.get('CHAN_HTTP2')
     .default('false')
     .asBoolStrict()
)

export const PAYLOAD_LIMIT: Getter<number> = memoize(() =>
  env.get('CHAN_PAYLOAD_LIMIT')
     .default(1048576)
     .asIntPositive()
)

export const ENQUEUE_PAYLOAD_LIMIT: Getter<number> = memoize(() =>
  env.get('CHAN_ENQUEUE_PAYLOAD_LIMIT')
     .default(PAYLOAD_LIMIT())
     .asIntPositive()
)

export const ADMIN_PASSWORD: Getter<string | undefined> = memoize(() =>
  env.get('CHAN_ADMIN_PASSWORD')
     .asString()
)

export const LIST_BASED_ACCESS_CONTROL: Getter<ListBasedAccessControl> = memoize(() => {
  const val = env.get('CHAN_LIST_BASED_ACCESS_CONTROL')
                 .asEnum(['whitelist', 'blacklist'])

  switch (val) {
    case 'whitelist': return ListBasedAccessControl.Whitelist
    case 'blacklist': return ListBasedAccessControl.Blacklist
    default: return ListBasedAccessControl.Disable
  }
})

export const TOKEN_BASED_ACCESS_CONTROL: Getter<boolean> = memoize(() =>
  env.get('CHAN_TOKEN_BASED_ACCESS_CONTROL')
     .default('false')
     .asBoolStrict()
)

export const READ_TOKEN_REQUIRED: Getter<boolean> = memoize(() =>
  env.get('CHAN_READ_TOKEN_REQUIRED')
     .default('false')
     .asBoolStrict()
)

export const WRITE_TOKEN_REQUIRED: Getter<boolean> = memoize(() =>
  env.get('CHAN_WRITE_TOKEN_REQUIRED')
     .default('false')
     .asBoolStrict()
)

export const JSON_VALIDATION: Getter<boolean> = memoize(() =>
  env.get('CHAN_JSON_VALIDATION')
     .default('false')
     .asBoolStrict()
)

export const DEFAULT_JSON_SCHEMA: Getter<object | undefined> = memoize(() =>
  env.get('CHAN_DEFAULT_JSON_SCHEMA')
     .asJsonObject()
)

export const JSON_PAYLOAD_ONLY: Getter<boolean> = memoize(() =>
  env.get('CHAN_JSON_PAYLOAD_ONLY')
     .default('false')
     .asBoolStrict()
)
