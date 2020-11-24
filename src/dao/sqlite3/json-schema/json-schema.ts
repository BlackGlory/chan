import { getDatabase } from '../database'

export function getAllIdsWithJsonSchema(): string[] {
  const result = getDatabase().prepare(`
    SELECT chan_id FROM chan_json_schema
  `).all()
  return result.map(x => x['chan_id'])
}

export function getJsonSchema(id: string): string | null {
  const result = getDatabase().prepare(`
    SELECT json_schema FROM chan_json_schema
     WHERE chan_id = $id;
  `).get({ id })
  if (result) return result['json_schema']
  else return null
}

export function setJsonSchema({ id, schema }: { id: string; schema: string }): void {
  getDatabase().prepare(`
    INSERT INTO chan_json_schema (chan_id, json_schema)
    VALUES ($id, $schema)
        ON CONFLICT(chan_id)
        DO UPDATE SET json_schema = $schema;
  `).run({ id, schema })
}

export function removeJsonSchema(id: string): void {
  getDatabase().prepare(`
    DELETE FROM chan_json_schema
     WHERE chan_id = $id;
  `).run({ id })
}
