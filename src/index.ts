import * as ConfigInSqlite3 from '@src/dao/config-in-sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

process.on('exit', () => {
  ConfigInSqlite3.closeDatabase()
})
process.on('SIGHUP', () => process.exit(128 + 1))
process.on('SIGINT', () => process.exit(128 + 2))
process.on('SIGTERM', () => process.exit(128 + 15))

;(async () => {
  ConfigInSqlite3.connectDatabase()
  await ConfigInSqlite3.prepareDatabase()

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
