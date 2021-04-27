import { getDatabase } from '../database'

export function getAllIdsWithTokens(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM chan_token;
  `).all()

  return result.map(x => x['namespace'])
}

export function getAllTokens(
  namespace: string
): Array<{ token: string, write: boolean, read: boolean }> {
  const result: Array<{
    token: string
    'write_permission': number
    'read_permission': number
  }> = getDatabase().prepare(`
    SELECT token
         , write_permission
         , read_permission
      FROM chan_token
     WHERE namespace = $namespace;
  `).all({ namespace })

  return result.map(x => ({
    token: x['token']
  , write: x['write_permission'] === 1
  , read: x['read_permission'] === 1
  }))
}

export function hasWriteTokens(namespace: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM chan_token
              WHERE namespace = $namespace
                AND write_permission = 1
           ) AS write_tokens_exist
  `).get({ namespace })

  return result['write_tokens_exist'] === 1
}

export function matchWriteToken({ token, namespace }: {
  token: string
  namespace: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM chan_token
              WHERE namespace = $namespace
                AND token = $token
                AND write_permission = 1
           ) AS matched
  `).get({ token, namespace })

  return result['matched'] === 1
}

export function setWriteToken({ token, namespace }: {
  token: string
  namespace: string
}): void {
  getDatabase().prepare(`
    INSERT INTO chan_token (token, namespace, write_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET write_permission = 1;
  `).run({ token, namespace })
}

export function unsetWriteToken({ token, namespace }: {
  token: string
  namespace: string
}): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE chan_token
         SET write_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  })()
}

export function hasReadTokens(namespace: string): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM chan_token
              WHERE namespace = $namespace
                AND read_permission = 1
           ) AS read_tokens_exist
  `).get({ namespace })

  return result['read_tokens_exist'] === 1
}

export function matchReadToken({ token, namespace }: {
  token: string;
  namespace: string
}): boolean {
  const result = getDatabase().prepare(`
    SELECT EXISTS(
             SELECT 1
               FROM chan_token
              WHERE namespace = $namespace
                AND token = $token
                AND read_permission = 1
           ) AS matched
  `).get({ token, namespace })

  return result['matched'] === 1
}

export function setReadToken({ token, namespace }: {
  token: string
  namespace: string
}): void {
  getDatabase().prepare(`
    INSERT INTO chan_token (token, namespace, read_permission)
    VALUES ($token, $namespace, 1)
        ON CONFLICT (token, namespace)
        DO UPDATE SET read_permission = 1;
  `).run({ token, namespace })
}

export function unsetReadToken({ token, namespace }: {
  token: string
  namespace: string
}): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE chan_token
         SET read_permission = 0
       WHERE token = $token
         AND namespace = $namespace;
    `).run({ token, namespace })

    deleteNoPermissionToken({ token, namespace })
  })()
}

function deleteNoPermissionToken({ token, namespace }: {
  token: string
  namespace: string
}): void {
  getDatabase().prepare(`
    DELETE FROM chan_token
     WHERE token = $token
       AND namespace = $namespace
       AND read_permission = 0
       AND write_permission = 0;
  `).run({ token, namespace })
}
