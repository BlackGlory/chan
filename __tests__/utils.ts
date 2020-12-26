import * as ConfigInSqlite3 from '@dao/config-in-sqlite3/database'
import { resetCache } from '@env/cache'

export async function resetDatabases() {
  await resetConfigInSqlite3Database()
}

export async function resetConfigInSqlite3Database() {
  ConfigInSqlite3.closeDatabase()
  await ConfigInSqlite3.prepareDatabase()
}

export function resetEnvironment() {
  // assigning a property on `process.env` will implicitly convert the value to a string.
  // use `delete` to delete a property from `process.env`.
  // see also: https://nodejs.org/api/process.html#process_process_env
  delete process.env.CHAN_ADMIN_PASSWORD
  delete process.env.CHAN_LIST_BASED_ACCESS_CONTROL
  delete process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL
  delete process.env.CHAN_READ_TOKEN_REQUIRED
  delete process.env.CHAN_WRITE_TOKEN_REQUIRED
  delete process.env.CHAN_JSON_VALIDATION
  delete process.env.CHAN_DEFAULT_JSON_SCHEMA
  delete process.env.CHAN_JSON_PAYLOAD_ONLY

  // reset memoize
  resetCache()
}
