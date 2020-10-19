import { getDatabase, reconnectDatabase, migrateDatabase } from '@dao/sqlite3/database'

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
  delete process.env.MPMC_HOST
  delete process.env.MPMC_PORT
  delete process.env.MPMC_ADMIN_PASSWORD
  delete process.env.MPMC_LIST_BASED_ACCESS_CONTROL
  delete process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.MPMC_DISABLE_NO_TOKENS
  delete process.env.MPMC_JSON_VALIDATION
  delete process.env.MPMC_DEFAULT_JSON_SCHEMA
  delete process.env.MPMC_JSON_PAYLOAD_ONLY
}
