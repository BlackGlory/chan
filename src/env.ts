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

export function NODE_ENV(): NodeEnv | undefined {
  switch (process.env.NODE_ENV) {
    case 'test': return NodeEnv.Test
    case 'development': return NodeEnv.Development
    case 'production': return NodeEnv.Production
  }
}

export function PORT(): number {
  return Number(process.env.MPMC_PORT) ?? 8080
}

export function HOST(): string {
  return process.env.MPMC_HOST ?? 'localhost'
}

export function ADMIN_PASSWORD(): string | undefined {
  return process.env.MPMC_ADMIN_PASSWORD
}

export function LIST_BASED_ACCESS_CONTROL(): ListBasedAccessControl {
  switch (process.env.MPMC_LIST_BASED_ACCESS_CONTROL) {
    case 'whitelist': return ListBasedAccessControl.Whitelist
    case 'blacklist': return ListBasedAccessControl.Blacklist
    default: return ListBasedAccessControl.Disable
  }
}

export function TOKEN_BASED_ACCESS_CONTROL(): boolean {
  return process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL === 'true'
}

export function DISABLE_NO_TOKENS(): boolean {
  return process.env.MPMC_DISABLE_NO_TOKENS === 'true'
}

export function HTTP2(): boolean {
  return process.env.MPMC_HTTP2 === 'true'
}

export function JSON_VALIDATION(): boolean {
  return process.env.MPMC_JSON_VALIDATION === 'true'
}

export function DEFAULT_JSON_SCHEMA(): string | undefined {
  return process.env.MPMC_DEFAULT_JSON_SCHEMA
}

export function JSON_PAYLOAD_ONLY(): boolean {
  return process.env.MPMC_JSON_PAYLOAD_ONLY === 'true'
}

export function CI(): boolean {
  return process.env.CI === 'true'
}

export function PAYLOAD_LIMIT(): number {
  if (process.env.MPMC_PAYLOAD_LIMIT) {
    return Number(process.env.MPMC_PAYLOAD_LIMIT)
  } else {
    return 1048576
  }
}

export function ENQUEUE_PAYLOAD_LIMIT(): number {
  if (process.env.MPMC_ENQUEUE_PAYLOAD_LIMIT) {
    return Number(process.env.MPMC_ENQUEUE_PAYLOAD_LIMIT)
  } else {
    return PAYLOAD_LIMIT()
  }
}