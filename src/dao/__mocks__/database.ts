import Database = require('better-sqlite3')

let db = new Database(':memory:')

export function getDatabase() {
  if (!db.open) reconnectDatabase()
  return db
}

export function reconnectDatabase() {
  db.close()
  db = new Database(':memory:')
}
