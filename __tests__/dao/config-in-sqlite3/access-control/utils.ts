import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawBlacklist {
  chan_id: string
}

interface IRawWhitelist {
  chan_id: string
}

interface IRawTokenPolicy {
  chan_id: string
  write_token_required: number | null
  read_token_required: number | null
}

interface IRawToken {
  token: string
  chan_id: string
  write_permission: number
  read_permission: number
}

export function setRawBlacklist(item: IRawBlacklist): IRawBlacklist {
  getDatabase().prepare(`
    INSERT INTO chan_blacklist (chan_id)
    VALUES ($chan_id);
  `).run(item)

  return item
}

export function hasRawBlacklist(id: string): boolean {
  return !!getRawBlacklist(id)
}

export function getRawBlacklist(id: string): IRawBlacklist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM chan_blacklist
     WHERE chan_id = $id;
  `).get({ id })
}

export function setRawWhitelist(props: IRawWhitelist): void {
  getDatabase().prepare(`
    INSERT INTO chan_whitelist (chan_id)
    VALUES ($chan_id);

  `).run(props)
}

export function hasRawWhitelist(id: string): boolean {
  return !!getRawWhitelist(id)
}

export function getRawWhitelist(id: string): IRawWhitelist | null {
  return getDatabase().prepare(`
    SELECT *
      FROM chan_whitelist
     WHERE chan_id = $id;
  `).get({ id })
}

export function setRawTokenPolicy<T extends IRawTokenPolicy>(item: T): T {
  getDatabase().prepare(`
    INSERT INTO chan_token_policy (
      chan_id
    , write_token_required
    , read_token_required
    )
    VALUES (
      $chan_id
    , $write_token_required
    , $read_token_required
    );
  `).run(item)

  return item
}

export function hasRawTokenPolicy(id: string): boolean {
  return !!getRawTokenPolicy(id)
}

export function getRawTokenPolicy(id: string): IRawTokenPolicy | null {
  return getDatabase().prepare(`
    SELECT *
      FROM chan_token_policy
     WHERE chan_id = $id;
  `).get({ id })
}

export function setRawToken(item: IRawToken): IRawToken {
  getDatabase().prepare(`
    INSERT INTO chan_token (
      token
    , chan_id
    , write_permission
    , read_permission
    )
    VALUES (
      $token
    , $chan_id
    , $write_permission
    , $read_permission
    );
  `).run(item)

  return item
}

export function hasRawToken(token: string, id: string): boolean {
  return !!getRawToken(token, id)
}

export function getRawToken(token: string, id: string): IRawToken | null {
  return getDatabase().prepare(`
    SELECT *
      FROM chan_token
     WHERE token = $token
       AND chan_id = $id;
  `).get({ token, id })
}
