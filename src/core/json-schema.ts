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

export function getAllNamespaces(): Promise<string[]> {
  return JsonSchemaDAO.getAllNamespacesWithJsonSchema()
}

export function get(namespace: string): Promise<string | null> {
  return JsonSchemaDAO.getJsonSchema(namespace)
}

export function set(namespace: string, schema: Json): Promise<void> {
  const schemaString = JSON.stringify(schema, null, 2)
  return JsonSchemaDAO.setJsonSchema({ namespace, schema: schemaString })
}

export function remove(namespace: string): Promise<void> {
  return JsonSchemaDAO.removeJsonSchema(namespace)
}

/**
 * @throws {InvalidPayload}
 */
export async function validate(namespace: string, payload: string): Promise<void> {
  const [err, json] = getErrorResult(() => JSON.parse(payload))
  if (err) throw new InvalidPayload()

  const jsonSchema= await JsonSchemaDAO.getJsonSchema(namespace)
  const schema = jsonSchema ? JSON.parse(jsonSchema) : DEFAULT_JSON_SCHEMA()
  if (schema) {
    const valid = ajv.validate(schema, json)
    if (!valid) throw new InvalidPayload(ajv.errorsText())
  }
}

export class InvalidPayload extends CustomError {}
