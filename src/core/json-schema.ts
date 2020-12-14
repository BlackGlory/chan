import Ajv from 'ajv'
import { JsonSchemaDAO } from '@dao'
import { DEFAULT_JSON_SCHEMA } from '@env'
import { JSON_VALIDATION } from '@env'
import { Json } from '@blackglory/types'

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

export async function validate(id: string, payload: string): Promise<void> {
  const json = JSON.parse(payload)
  const jsonSchema= await JsonSchemaDAO.getJsonSchema(id)
  const schema = jsonSchema ?? DEFAULT_JSON_SCHEMA()
  if (schema) {
    const ajv = new Ajv()
    const valid = ajv.validate(JSON.parse(schema), json)
    if (!valid) throw new Error(ajv.errorsText())
  }
}
