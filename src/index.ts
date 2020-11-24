import { prepareDatabase as prepareSqlite3Database } from '@src/dao/sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

process.on('SIGHUP', () => process.exit(1))

;(async () => {
  await prepareSqlite3Database()

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
