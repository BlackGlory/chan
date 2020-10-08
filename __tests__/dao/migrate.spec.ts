import { migrateToLatest } from '@src/dao/migrate'
import Database = require('better-sqlite3')
import * as path from 'path'
import { path as appRoot } from 'app-root-path'

describe('migrateToLatest()', () => {
  it('upgrades database schema to latest version', async () => {
    const db = new Database(':memory:')
    const migrationsPath = path.join(appRoot, 'src/migrations')

    await migrateToLatest({ db, migrationsPath })
  })
})
