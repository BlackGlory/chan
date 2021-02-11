import Database = require('better-sqlite3')
import type { Database as IDatabase } from 'better-sqlite3'
import * as path from 'path'
import * as fs from 'fs-extra'
import { NODE_ENV, NodeEnv, DATA } from '@env'
import { strict as assert } from 'assert'
import { migrateDatabase } from './utils'
assert(NODE_ENV() !== NodeEnv.Test)

let db: IDatabase

export function openDatabase(): void {
  const dataPath = DATA()
  const dataFilename = path.join(dataPath, 'config.db')
  fs.ensureDirSync(dataPath)

  db = new Database(dataFilename)
}

export async function prepareDatabase(): Promise<void> {
  assert(db)
  await migrateDatabase(db)
}

export function getDatabase(): IDatabase {
  assert(db)
  return db
}

export function closeDatabase(): void {
  if (db) db.close()
}
