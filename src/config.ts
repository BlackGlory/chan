export enum RBAC {
  Disable
, Whitelist
, Blacklist
}

export function PORT() {
  return Number(process.env.MPMC_PORT) || 8080
}

export function HOST() {
  return process.env.MPMC_HOST || 'localhost'
}

export function ADMIN_PASSWORD() {
  return process.env.MPMC_ADMIN_PASSWORD
}

export function LIST_BASED_ACCESS_CONTROL() {
  switch (process.env.MPMC_LIST_BASED_ACCESS_CONTROL) {
    case 'whitelist': return RBAC.Whitelist
    case 'blacklist': return RBAC.Blacklist
    default: return RBAC.Disable
  }
}

export function TOKEN_BASED_ACCESS_CONTROL() {
  return process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL === 'true'
}

export function DISABLE_NO_TOKENS() {
  return process.env.MPMC_DISABLE_NO_TOKENS === 'true'
}

export function HTTP2() {
  return process.env.MPMC_HTTP2 === 'true'
}

export function JSON_SCHEMA() {
  return process.env.MPMC_JSON_SCHEMA
}

export function JSON_ONLY() {
  return process.env.MPMC_JSON_ONLY === 'true'
}
