import { migrateDatabase } from '@dao/sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST } from '@config'

;(async () => {
  await migrateDatabase()

  const server = await buildServer({ logger: true })
  server.listen(PORT(), HOST(), (err, address) => {
    if (err) throw err
  })
})()
