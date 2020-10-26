import { migrateDatabase } from '@src/dao/config/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

;(async () => {
  await migrateDatabase()

  const server = await buildServer({ logger: true })
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
