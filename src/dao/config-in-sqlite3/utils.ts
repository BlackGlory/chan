import * as path from 'path'
import type { Database as IDatabase } from 'better-sqlite3'
import { path as appRoot } from 'app-root-path'
import { readMigrations } from 'migrations-file'
import { migrate } from '@blackglory/better-sqlite3-migrations'

export async function migrateDatabase(db: IDatabase): Promise<void> {
  const migrationsPath = path.join(appRoot, 'migrations/config-in-sqlite3')
  const migrations = await readMigrations(migrationsPath)
  migrate(db, migrations)
}

export function enableAutoVacuum(db: IDatabase): void {
  db.pragma('main.auto_vacuum = FULL;')
  db.prepare('VACUUM;').run()
}
