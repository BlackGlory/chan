import Database = require('better-sqlite3')
import { path as appRoot } from 'app-root-path'
import * as path from 'path'
import * as fs from 'fs-extra'

const dataDir = path.join(appRoot, 'data')
const dataFile = path.join(dataDir, 'database.sqlite')
fs.ensureDirSync(dataDir)
let db = new Database(dataFile)

export function getDatabase() {
  if (!db.open) reconnectDatabase()
  return db
}

export function reconnectDatabase() {
  db.close()
  db = new Database(dataFile)
}
