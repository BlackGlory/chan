import { getDatabase } from './database'

export function getAllIds(): string[] {
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
               WHERE mpmc_id = $id AND enqueue_permission=1
           ) AS enqueue_tokens_exist
  `).get({ id })
  return result['enqueue_tokens_exist'] === 1
}

export function setEnqueueToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  const row = db.prepare(`
    SELECT enqueue_permission
      FROM mpmc_tbac
     WHERE token = $token AND mpmc_id = $id;
  `).get({ token, id })
  if (row) {
    if (row['enqueue_permission'] === 0) {
      db.prepare(`
        UPDATE mpmc_tbac
           SET enqueue_permission = 1
         WHERE token = $token AND mpmc_id = $id;
      `).run({ token, id })
    }
  } else {
    db.prepare(`
      INSERT INTO mpmc_tbac (token, mpmc_id, dequeue_permission, enqueue_permission)
      VALUES ($token, $id, 0, 1);
    `).run({ token, id })
  }
}

export function unsetEnqueueToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    UPDATE mpmc_tbac
       SET enqueue_permission = 0
     WHERE token = $token AND mpmc_id = $id;
  `).run({ token, id })
}

export function hasDequeueTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mpmc_tbac
               WHERE mpmc_id = $id AND dequeue_permission=1
           ) AS dequeue_tokens_exist
  `).get({ id })
  return result['dequeue_tokens_exist'] === 1
}

export function setDequeueToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  const row = db.prepare(`
    SELECT dequeue_permission
      FROM mpmc_tbac
     WHERE token = $token AND mpmc_id = $id;
  `).get({ token, id })
  if (row) {
    if (row['dequeue_permission'] === 0) {
      db.prepare(`
        UPDATE mpmc_tbac
           SET dequeue_permission = 1
         WHERE token = $token AND mpmc_id = $id;
      `).run({ token, id })
    }
  } else {
    db.prepare(`
      INSERT INTO mpmc_tbac (token, mpmc_id, dequeue_permission, enqueue_permission)
      VALUES ($token, $id, 1, 0);
    `).run({ token, id })
  }
}

export function unsetDequeueToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    UPDATE mpmc_tbac
       SET dequeue_permission = 0
     WHERE token = $token AND mpmc_id = $id;
  `).run({ token, id })
}