export const tokenSchema = {
  type: 'string'
, pattern: '^[a-zA-Z0-9\\.\\-_]{0,255}$'
}

export const namespaceSchema = {
  type: 'string'
, pattern: '^[a-zA-Z0-9\\.\\-_]{0,255}$'
}
