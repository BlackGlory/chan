import * as path from 'path'
import { migrateToLatest } from '@dao/sqlite3/migrate'
import { getDatabase } from '@dao/sqlite3/database'
import { path as appRoot } from 'app-root-path'
import { buildServer } from './server'
import { PORT, HOST } from '@src/config'

migrateToLatest({
  db: getDatabase()
, migrationsPath: path.join(appRoot, 'migrations')
})

buildServer({ logger: true }).listen(PORT(), HOST(), (err, address) => {
  if (err) throw err
})
