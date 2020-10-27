import { getDatabase } from './database'

export function getAllIdsWithJsonSchema(): string[] {
  const result = getDatabase().prepare(`
    SELECT mpmc_id FROM mpmc_json_schema
  `).all()
  return result.map(x => x['mpmc_id'])
}

export function getJsonSchema(id: string): string | null {
  const result = getDatabase().prepare(`
    SELECT json_schema FROM mpmc_json_schema
     WHERE mpmc_id = $id;
  `).get({ id })
  if (result) return result['json_schema']
  else return null
}

export function setJsonSchema({ id, schema }: { id: string; schema: string }): void {
  getDatabase().prepare(`
    INSERT INTO mpmc_json_schema (mpmc_id, json_schema)
    VALUES ($id, $schema)
        ON CONFLICT(mpmc_id)
        DO UPDATE SET json_schema = $schema;
  `).run({ id, schema })
}

export function removeJsonSchema(id: string): void {
  getDatabase().prepare(`
    DELETE FROM mpmc_json_schema
     WHERE mpmc_id = $id;
  `).run({ id })
}
