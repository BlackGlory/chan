import * as path from 'path'
import { migrateToLatest } from './dao/migrate'
import { path as appRoot } from 'app-root-path'
import { buildServer } from './server'
import { PORT, HOST } from '@src/config'
import { getDatabase } from './dao/database'

migrateToLatest({
  db: getDatabase()
, migrationsPath: path.join(appRoot, 'migrations')
})

buildServer({ logger: true }).listen(PORT(), HOST(), (err, address) => {
  if (err) throw err
})
