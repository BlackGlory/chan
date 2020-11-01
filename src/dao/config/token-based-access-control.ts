import { getDatabase } from './database'

export function getAllIdsWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT chan_id
      FROM chan_tbac;
  `).all()
  return result.map(x => x['chan_id'])
}

export function getAllTokens(id: string): Array<{ token: string, write: boolean, read: boolean }> {
  const result: Array<{
    token: string
    'write_permission': number
    'read_permission': number
  }> = getDatabase().prepare(`
    SELECT token
         , write_permission
         , read_permission
      FROM chan_tbac
     WHERE chan_id = $id;
  `).all({ id })
  return result.map(x => ({
    token: x['token']
  , write: x['write_permission'] === 1
  , read: x['read_permission'] === 1
  }))
}

export function hasWriteTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM chan_tbac
              WHERE chan_id = $id
                AND write_permission = 1
           ) AS write_tokens_exist
  `).get({ id })
  return result['write_tokens_exist'] === 1
}

export function matchWriteToken({ token, id }: {
  token: string
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM chan_tbac
              WHERE chan_id = $id
                AND token = $token
                AND write_permission = 1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setWriteToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO chan_tbac (token, chan_id, write_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, chan_id)
        DO UPDATE SET write_permission = 1;
  `).run({ token, id })
}

export function unsetWriteToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE chan_tbac
         SET write_permission = 0
       WHERE token = $token
         AND chan_id = $id;
    `).run({ token, id })
    deleteNoPermissionToken({ token, id })
  })()
}

export function hasReadTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM chan_tbac
              WHERE chan_id = $id
                AND read_permission = 1
           ) AS read_tokens_exist
  `).get({ id })
  return result['read_tokens_exist'] === 1
}

export function matchReadToken({ token, id }: {
  token: string;
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM chan_tbac
              WHERE chan_id = $id
                AND token = $token
                AND read_permission = 1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setReadToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO chan_tbac (token, chan_id, read_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, chan_id)
        DO UPDATE SET read_permission = 1;
  `).run({ token, id })
}

export function unsetReadToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE chan_tbac
         SET read_permission = 0
       WHERE token = $token
         AND chan_id = $id;
    `).run({ token, id })
    deleteNoPermissionToken({ token, id })
  })()
}

function deleteNoPermissionToken({ token, id }: { token: string, id: string }) {
  getDatabase().prepare(`
    DELETE FROM chan_tbac
     WHERE token = $token
       AND chan_id = $id
       AND read_permission = 0
       AND write_permission = 0;
  `).run({ token, id })
}
