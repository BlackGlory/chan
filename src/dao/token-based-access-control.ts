import { getDatabase } from './database'
import 'jest-extended'

export function hasWriteTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mpmc_tbac
               WHERE mpmc_id = $id AND write_permission=1
           ) AS write_tokens_exist
  `).get({ id })
  return result['write_tokens_exist'] === 1
}

export function addWriteToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  const row = db.prepare(`
    SELECT write_permission
      FROM mpmc_tbac
     WHERE token = $token AND mpmc_id = $id;
  `).get({ token, id })
  if (row) {
    if (row['write_permission'] === 0) {
      db.prepare(`
        UPDATE mpmc_tbac
           SET write_permission = 1
         WHERE token = $token AND mpmc_id = $id;
      `).run({ token, id })
    }
  } else {
    db.prepare(`
      INSERT INTO mpmc_tbac (token, mpmc_id, read_permission, write_permission)
      VALUES ($token, $id, 0, 1);
    `).run({ token, id })
  }
}

export function removeWriteToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    UPDATE mpmc_tbac
       SET write_permission = 0
     WHERE token = $token AND mpmc_id = $id;
  `).run({ token, id })
}

export function hasReadTokens(id: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mpmc_tbac
               WHERE mpmc_id = $id AND read_permission=1
           ) AS read_tokens_exist
  `).get({ id })
  return result['read_tokens_exist'] === 1
}

export function addReadToken({ token, id }: { token: string; id: string }) {
  const db = getDatabase()
  const row = db.prepare(`
    SELECT read_permission
      FROM mpmc_tbac
     WHERE token = $token AND mpmc_id = $id;
  `).get({ token, id })
  if (row) {
    if (row['read_permission'] === 0) {
      db.prepare(`
        UPDATE mpmc_tbac
           SET read_permission = 1
         WHERE token = $token AND mpmc_id = $id;
      `).run({ token, id })
    }
  } else {
    db.prepare(`
      INSERT INTO mpmc_tbac (token, mpmc_id, read_permission, write_permission)
      VALUES ($token, $id, 1, 0);
    `).run({ token, id })
  }
}

export function removeReadToken({ token, id }: { token: string; id: string }) {
  getDatabase().prepare(`
    UPDATE mpmc_tbac
       SET read_permission = 0
     WHERE token = $token AND mpmc_id = $id;
  `).run({ token, id })
}
