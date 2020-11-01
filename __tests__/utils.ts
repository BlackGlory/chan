import { getDatabase, reconnectDatabase, migrateDatabase } from '@dao/config/database'

export async function prepareDatabase() {
  reconnectDatabase()
  const db = getDatabase()
  await migrateDatabase()
  return db
}

export async function resetEnvironment() {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // sjee also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.CHAN_HOST
  delete process.env.CHAN_PORT
  delete process.env.CHAN_ADMIN_PASSWORD
  delete process.env.CHAN_LIST_BASED_ACCESS_CONTROL
  delete process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.CHAN_DISABLE_NO_TOKENS
  delete process.env.CHAN_JSON_VALIDATION
  delete process.env.CHAN_DEFAULT_JSON_SCHEMA
  delete process.env.CHAN_JSON_PAYLOAD_ONLY
}
