import * as path from 'path'
import { migrateToLatest } from './dao/migrate'
import { path as appRoot } from 'app-root-path'
import { startup } from './server'
import { getDatabase } from './dao/database'

migrateToLatest({
  db: getDatabase()
, migrationsPath: path.join(appRoot, 'migrations')
})

startup()
