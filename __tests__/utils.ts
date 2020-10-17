import { path as appRoot } from 'app-root-path'
import * as path from 'path'
import { getDatabase, reconnectDatabase } from '@src/dao/database'
import { migrateToLatest } from '@src/dao/migrate'

export async function prepareDatabase() {
  reconnectDatabase()
  const db = getDatabase()
  await migrateToLatest({ db, migrationsPath: path.join(appRoot, 'migrations') })
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
  delete process.env.MPMC_JSON_SCHEMA_VALIDATION
  delete process.env.MPMC_DEFAULT_JSON_SCHEMA
  delete process.env.MPMC_JSON_PAYLOAD_ONLY
}
