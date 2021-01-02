import Database = require('better-sqlite3')
import type { Database as IDatabase } from 'better-sqlite3'
import { migrateDatabase } from '../utils'
import { strict as assert } from 'assert'

let db = new Database(':memory:')

export function getDatabase(): IDatabase {
  assert(db)
  return db
}

export function closeDatabase(): void {
  if (db) db.close()
}

export async function prepareDatabase(): Promise<void> {
  assert(db)
  await migrateDatabase(db)
}

export function connectDatabase(): void {
  db = new Database(':memory:')
}
