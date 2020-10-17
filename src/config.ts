export enum RBAC {
  Disable
, Whitelist
, Blacklist
}

export function PORT() {
  return Number(process.env.PORT) || 8080
}

export function HOST() {
  return process.env.HOST || 'localhost'
}

export function ADMIN_PASSWORD() {
  return process.env.ADMIN_PASSWORD
}

export function LIST_BASED_ACCESS_CONTROL() {
  switch (process.env.LIST_BASED_ACCESS_CONTROL) {
    case 'whitelist': return RBAC.Whitelist
    case 'blacklist': return RBAC.Blacklist
    default: return RBAC.Disable
  }
}

export function TOKEN_BASED_ACCESS_CONTROL() {
  return process.env.TOKEN_BASED_ACCESS_CONTROL === 'true'
}

export function DISABLE_NO_TOKENS() {
  return process.env.DISABLE_NO_TOKENS === 'true'
}

export function HTTP2() {
  return process.env.HTTP2 === 'true'
}
