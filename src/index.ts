import { migrateDatabase } from '@src/dao/config/database'
import { buildServer } from './server'
import { PORT, HOST, CI } from '@env'

;(async () => {
  await migrateDatabase()

  const server = await buildServer()
  await server.listen(PORT(), HOST())
  if (CI()) await server.close()
})()
