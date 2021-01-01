import {
  prepareDatabase as prepareConfigInSqlite3Database
, closeDatabase as closeConfigInSqlite3Database
} from '@src/dao/config-in-sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

process.on('exit', () => {
  closeConfigInSqlite3Database()
})
process.on('SIGHUP', () => process.exit(128 + 1))
process.on('SIGINT', () => process.exit(128 + 2))
process.on('SIGTERM', () => process.exit(128 + 15))

;(async () => {
  await prepareConfigInSqlite3Database()

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
