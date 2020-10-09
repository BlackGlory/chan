export const PORT: number = Number(process.env.PORT) || 8080
export const HOST: string = process.env.HOST || 'localhost'

enum RBAC {
  Disable
, Whitelist
, Blacklist
}

// 管理员密码, 需要使用此密码通过HTTP鉴权(Authorization)访问相关API.
export const ADMIN_PASSWORD: string | undefined =
process.env.ADMIN_PASSWORD

// 是否在MPMC上启用基于名单的访问控制
export const LIST_BASED_ACCESS_CONTROL: RBAC =
(() => {
  switch (process.env.MPMC_RESOURCE_BASED_ACCESS_CONTROL) {
    case 'whitelist': return RBAC.Whitelist
    case 'blacklist': return RBAC.Blacklist
    default: return RBAC.Disable
  }
})()

// 是否在MPMC上启用基于TOKEN的访问控制
export const TOKEN_BASED_ACCESS_CONTROL: boolean =
process.env.TOKEN_BASED_ACCESS_CONTROL === 'true'

// 以下是与基于TOKEN的访问控制有关的环境变量, 如果关闭对应的访问控制, 则不起作用
// 禁用无token的MPMC
export const DISABLE_NO_TOKENS: boolean =
process.env.DISABLE_NO_TOKENS=== 'true'
