import * as AccessControlDatabase from '@dao/access-control/database'
import * as JsonSchemaDatabase from '@dao/json-schema/database'

export async function resetDatabases() {
  await resetAccessControlDatabase()
  await resetJsonSchemaDatabase()
}

export async function resetAccessControlDatabase() {
  AccessControlDatabase.closeDatabase()
  await AccessControlDatabase.prepareDatabase()
}

export async function resetJsonSchemaDatabase() {
  JsonSchemaDatabase.closeDatabase()
  await JsonSchemaDatabase.prepareDatabase()
}

export function resetEnvironment() {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // sjee also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.CHAN_HOST
  delete process.env.CHAN_PORT
  delete process.env.CHAN_ADMIN_PASSWORD
  delete process.env.CHAN_LIST_BASED_ACCESS_CONTROL
  delete process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.CHAN_READ_TOKEN_REQUIRED
  delete process.env.CHAN_WRITE_TOKEN_REQUIRED
  delete process.env.CHAN_JSON_VALIDATION
  delete process.env.CHAN_DEFAULT_JSON_SCHEMA
  delete process.env.CHAN_JSON_PAYLOAD_ONLY
}
