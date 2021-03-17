import Ajv from 'ajv'
import { JsonSchemaDAO } from '@dao'
import { DEFAULT_JSON_SCHEMA } from '@env'
import { JSON_VALIDATION } from '@env'
import { Json } from 'justypes'
import { getErrorResult } from 'return-style'
import { CustomError } from '@blackglory/errors'

const ajv = new Ajv()

export function isEnabled(): boolean {
  return JSON_VALIDATION()
}

export function getAllIds(): Promise<string[]> {
  return JsonSchemaDAO.getAllIdsWithJsonSchema()
}

export function get(id: string): Promise<string | null> {
  return JsonSchemaDAO.getJsonSchema(id)
}

export function set(id: string, schema: Json): Promise<void> {
  const schemaString = JSON.stringify(schema, null, 2)
  return JsonSchemaDAO.setJsonSchema({ id, schema: schemaString })
}

export function remove(id: string): Promise<void> {
  return JsonSchemaDAO.removeJsonSchema(id)
}

/**
 * @throws {InvalidPayload}
 */
export async function validate(id: string, payload: string): Promise<void> {
  const [err, json] = getErrorResult(() => JSON.parse(payload))
  if (err) throw new InvalidPayload()

  const jsonSchema= await JsonSchemaDAO.getJsonSchema(id)
  const schema = jsonSchema ? JSON.parse(jsonSchema) : DEFAULT_JSON_SCHEMA()
  if (schema) {
    const valid = ajv.validate(schema, json)
    if (!valid) throw new InvalidPayload(ajv.errorsText())
  }
}

export class InvalidPayload extends CustomError {}
