import { getDatabase } from '../database'

export function getAllNamespacesWithTokenPolicies(): string[] {
  const result = getDatabase().prepare(`
    SELECT namespace
      FROM chan_token_policy;
  `).all()
  return result.map(x => x['namespace'])
}

export function getTokenPolicies(namespace: string): {
  writeTokenRequired: boolean | null
  readTokenRequired: boolean | null
} {
  const row: {
    'write_token_required': number | null
  , 'read_token_required': number | null
  } = getDatabase().prepare(`
    SELECT write_token_required
         , read_token_required
      FROM chan_token_policy
     WHERE namespace = $namespace;
  `).get({ namespace })

  if (row) {
    const writeTokenRequired = row['write_token_required']
    const readTokenRequired = row['read_token_required']

    return {
      writeTokenRequired:
        writeTokenRequired === null
        ? null
        : numberToBoolean(writeTokenRequired)
    , readTokenRequired:
        readTokenRequired === null
        ? null
        : numberToBoolean(readTokenRequired)
    }
  } else {
    return { writeTokenRequired: null, readTokenRequired: null }
  }
}

export function setWriteTokenRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO chan_token_policy (namespace, write_token_required)
    VALUES ($namespace, $writeTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET write_token_required = $writeTokenRequired;
  `).run({ namespace, writeTokenRequired: booleanToNumber(val) })
}

export function unsetWriteTokenRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE chan_token_policy
         SET write_token_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

export function setReadTokenRequired(namespace: string, val: boolean): void {
  getDatabase().prepare(`
    INSERT INTO chan_token_policy (namespace, read_token_required)
    VALUES ($namespace, $readTokenRequired)
        ON CONFLICT(namespace)
        DO UPDATE SET read_token_required = $readTokenRequired;
  `).run({ namespace, readTokenRequired: booleanToNumber(val) })
}

export function unsetReadTokenRequired(namespace: string): void {
  const db = getDatabase()
  db.transaction(() => {
    db.prepare(`
      UPDATE chan_token_policy
         SET read_token_required = NULL
       WHERE namespace = $namespace;
    `).run({ namespace })

    deleteNoPoliciesRow(namespace)
  })()
}

function deleteNoPoliciesRow(namespace: string): void {
  getDatabase().prepare(`
    DELETE FROM chan_token_policy
     WHERE namespace = $namespace
       AND write_token_required = NULL
       AND read_token_required = NULL
  `).run({ namespace })
}

function numberToBoolean(val: number): boolean {
  if (val === 0) {
    return false
  } else {
    return true
  }
}

function booleanToNumber(val: boolean): number {
  if (val) {
    return 1
  } else {
    return 0
  }
}
