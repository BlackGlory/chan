import { path as appRoot } from 'app-root-path'
import * as path from 'path'
import { getDatabase, reconnectDatabase } from '@src/dao/database'
import { migrateToLatest } from '@src/dao/migrate'

export async function prepareDatabase() {
  reconnectDatabase()
  const db = getDatabase()
  await migrateToLatest({ db, migrationsPath: path.join(appRoot, 'migrations') })
  return db
}
