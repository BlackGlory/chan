import { getDatabase } from './database'

export function getAllIdsWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT mpmc_id
      FROM mpmc_tbac;
  `).all()
  return result.map(x => x['mpmc_id'])
}

export function getAllTokens(id: string): Array<{ token: string, enqueue: boolean, dequeue: boolean }> {
  const result: Array<{
    token: string
    'enqueue_permission': number
    'dequeue_permission': number
  }> = getDatabase().prepare(`
    SELECT token
         , enqueue_permission
         , dequeue_permission
      FROM mpmc_tbac
     WHERE mpmc_id = $id;
  `).all({ id })
  return result.map(x => ({
    token: x['token']
  , enqueue: x['enqueue_permission'] === 1
  , dequeue: x['dequeue_permission'] === 1
  }))
}

export function hasEnqueueTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mpmc_tbac
              WHERE mpmc_id = $id
                AND enqueue_permission=1
           ) AS enqueue_tokens_exist
  `).get({ id })
  return result['enqueue_tokens_exist'] === 1
}

export function matchEnqueueToken({ token, id }: {
  token: string
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mpmc_tbac
              WHERE mpmc_id = $id
                AND token = $token
                AND enqueue_permission=1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setEnqueueToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO mpmc_tbac (token, mpmc_id, enqueue_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, mpmc_id)
        DO UPDATE SET enqueue_permission = 1;
  `).run({ token, id })
}

export function unsetEnqueueToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mpmc_tbac
        SET enqueue_permission = 0
      WHERE token = $token
        AND mpmc_id = $id;
    `).run({ token, id })
    deleteNoPermissionToken({ token, id })
  })()
}

export function hasDequeueTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mpmc_tbac
              WHERE mpmc_id = $id
                AND dequeue_permission=1
           ) AS dequeue_tokens_exist
  `).get({ id })
  return result['dequeue_tokens_exist'] === 1
}

export function matchDequeueToken({ token, id }: {
  token: string;
  id: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
              FROM mpmc_tbac
             WHERE mpmc_id = $id
               AND token = $token
               AND dequeue_permission = 1
           ) AS matched
  `).get({ token, id })
  return result['matched'] === 1
}

export function setDequeueToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    INSERT INTO mpmc_tbac (token, mpmc_id, dequeue_permission)
    VALUES ($token, $id, 1)
        ON CONFLICT (token, mpmc_id)
        DO UPDATE SET dequeue_permission = 1;
  `).run({ token, id })
}

export function unsetDequeueToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE mpmc_tbac
        SET dequeue_permission = 0
      WHERE token = $token
        AND mpmc_id = $id;
    `).run({ token, id })
    deleteNoPermissionToken({ token, id })
  })()
}

function deleteNoPermissionToken({ token, id }: { token: string, id: string }) {
  getDatabase().prepare(`
    DELETE FROM mpmc_tbac
      WHERE token = $token
        AND mpmc_id = $id
        AND dequeue_permission = 0
        AND enqueue_permission = 0;
  `).run({ token, id })
}
