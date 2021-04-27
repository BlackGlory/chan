import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawBlacklist {
  namespace: string
}

interface IRawWhitelist {
  namespace: string
}

interface IRawTokenPolicy {
  namespace: string
  write_token_required: number | null
  read_token_required: number | null
}

interface IRawToken {
  token: string
  namespace: string
  write_permission: number
  read_permission: number
}

export function setRawBlacklist(raw: IRawBlacklist): IRawBlacklist {
  getDatabase().prepare(`
    INSERT INTO chan_blacklist (namespace)
    VALUES ($namespace);
  `).run(raw)

  return raw
}

export function hasRawBlacklist(namespace: string): boolean {
  return !!getRawBlacklist(namespace)
}

export function getRawBlacklist(namespace: string): IRawBlacklist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM chan_blacklist
     WHERE namespace = $namespace;
  `).get({ namespace })
}

export function setRawWhitelist(raw: IRawWhitelist): void {
  getDatabase().prepare(`
    INSERT INTO chan_whitelist (namespace)
    VALUES ($namespace);

  `).run(raw)
}

export function hasRawWhitelist(namespace: string): boolean {
  return !!getRawWhitelist(namespace)
}

export function getRawWhitelist(namespace: string): IRawWhitelist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM chan_whitelist
     WHERE namespace = $namespace;
  `).get({ namespace })
}

export function setRawTokenPolicy<T extends IRawTokenPolicy>(raw: T): T {
  getDatabase().prepare(`
    INSERT INTO chan_token_policy (
      namespace
    , write_token_required
    , read_token_required
    )
    VALUES (
      $namespace
    , $write_token_required
    , $read_token_required
    );
  `).run(raw)

  return raw
}

export function hasRawTokenPolicy(namespace: string): boolean {
  return !!getRawTokenPolicy(namespace)
}

export function getRawTokenPolicy(namespace: string): IRawTokenPolicy | null {
  return getDatabase().prepare(`
    SELECT *
      FROM chan_token_policy
     WHERE namespace = $namespace;
  `).get({ namespace })
}

export function setRawToken(raw: IRawToken): IRawToken {
  getDatabase().prepare(`
    INSERT INTO chan_token (
      token
    , namespace
    , write_permission
    , read_permission
    )
    VALUES (
      $token
    , $namespace
    , $write_permission
    , $read_permission
    );
  `).run(raw)

  return raw
}

export function hasRawToken(token: string, namespace: string): boolean {
  return !!getRawToken(token, namespace)
}

export function getRawToken(token: string, namespace: string): IRawToken | null {
  return getDatabase().prepare(`
    SELECT *
      FROM chan_token
     WHERE token = $token
       AND namespace = $namespace;
  `).get({ token, namespace })
}
