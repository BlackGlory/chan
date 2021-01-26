import { getDatabase } from '@dao/config-in-sqlite3/database'

interface IRawJsonSchema {
  chan_id: string
  json_schema: string
}

export function setRawJsonSchema(props: IRawJsonSchema): void {
  getDatabase().prepare(`
    INSERT INTO chan_json_schema (chan_id, json_schema)
    VALUES ($chan_id, $json_schema);
  `).run(props)
}

export function hasRawJsonSchema(id: string): boolean {
  return !!getRawJsonSchema(id)
}

export function getRawJsonSchema(id: string): IRawJsonSchema | null {
  return getDatabase().prepare(`
    SELECT *
      FROM chan_json_schema
     WHERE chan_id = $id;
  `).get({ id })
}
