import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawJsonSchema {
  namespace: string
  json_schema: string
}

export function setRawJsonSchema(raw: IRawJsonSchema): IRawJsonSchema {
  getDatabase().prepare(`
    INSERT INTO chan_json_schema (namespace, json_schema)
    VALUES ($namespace, $json_schema);
  `).run(raw)

  return raw
}

export function hasRawJsonSchema(namespace: string): boolean {
  return !!getRawJsonSchema(namespace)
}

export function getRawJsonSchema(namespace: string): IRawJsonSchema | null {
  return getDatabase().prepare(`
    SELECT *
      FROM chan_json_schema
     WHERE namespace = $namespace;
  `).get({ namespace })
}
