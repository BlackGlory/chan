import * as path from 'path'
import { path as appRoot } from 'app-root-path'
import { readMigrations } from 'migrations-file'
import { migrate } from '@blackglory/better-sqlite3-migrations'
import Database = require('better-sqlite3')

const migrationsPath = path.join(appRoot, 'migrations/config')
let db = new Database(':memory:')

export function getDatabase() {
  if (!db.open) reconnectDatabase()
  return db
}

export function reconnectDatabase() {
  db.close()
  db = new Database(':memory:')
}

export async function migrateDatabase() {
  const migrations = await readMigrations(migrationsPath)
  migrate(db, migrations)
}
