import { migrateDatabase } from '@dao/sqlite3/database'
import { buildServer } from './server'
import { PORT, HOST } from '@src/config'

;(async () => {
  await migrateDatabase()

  buildServer({ logger: true }).listen(PORT(), HOST(), (err, address) => {
    if (err) throw err
  })
})
