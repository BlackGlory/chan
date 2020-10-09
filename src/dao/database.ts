import Database = require('better-sqlite3')
import { path as appRoot } from 'app-root-path'
import * as path from 'path'

let db = new Database(path.join(appRoot, 'data/database.sqlite'))

export function getDatabase() {
  if (!db.open) reconnectDatabase()
  return db
}

export function reconnectDatabase() {
  db.close()
  db = new Database(path.join(appRoot, 'data/database.sqlite'))
}
