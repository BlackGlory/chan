import Database = require('better-sqlite3')
import type { Database as IDatabase } from 'better-sqlite3'
import { path as appRoot } from 'app-root-path'
import * as path from 'path'
import * as fs from 'fs-extra'
import { readMigrations } from 'migrations-file'
import { migrate } from '@blackglory/better-sqlite3-migrations'
import { NODE_ENV, NodeEnv } from '@env'
import { strict as assert } from 'assert'
assert(NODE_ENV() !== NodeEnv.Test)

let db: IDatabase

export function getDatabase() {
  return db
}

export function closeDatabase() {
  if (db) db.close()
}

export async function prepareDatabase() {
  db = connectDatabase()
  await migrateDatabase(db)
}

function connectDatabase(): IDatabase {
  const dataPath = path.join(appRoot, 'data')
  const dataFilename = path.join(dataPath, 'config.db')
  fs.ensureDirSync(dataPath)
  return new Database(dataFilename)
}

async function migrateDatabase(db: IDatabase) {
  const migrationsPath = path.join(appRoot, 'migrations/config-in-sqlite3')
  const migrations = await readMigrations(migrationsPath)
  migrate(db, migrations)
}
