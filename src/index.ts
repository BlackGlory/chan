import { migrateDatabase } from '@dao/sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@config'

;(async () => {
  await migrateDatabase()

  const server = await buildServer({ logger: true })
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
