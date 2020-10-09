import { readMigrations } from './migration-file'
import { Database } from 'better-sqlite3'

export async function migrateToLatest(options: { db: Database, migrationsPath: string }) {
  const migrations = await readMigrations(options.migrationsPath)
  const lastVersion = migrations.reduce((max, cur) => Math.max(cur.version, max), 0)
  await migrateTo(lastVersion, options)
}

export async function migrateTo(targetVersion: number, { db, migrationsPath }: { db: Database, migrationsPath: string }) {
  // console.group('Schema Migration')
  const migrations = await readMigrations(migrationsPath)

  let currentVersion = getDatabaseVersion()
  // console.info(`Current schema version: ${ currentVersion }`)
  // console.info(`Target schema version: ${ targetVersion }`)

  while ((currentVersion = getDatabaseVersion()) !== targetVersion) {
    if (currentVersion < targetVersion) {
      upgrade()
    } else {
      downgrade()
    }
  }

  console.groupEnd()

  function upgrade() {
    const currentVersion = getDatabaseVersion()
    const targetVersion = currentVersion + 1

    // console.group(`Upgrading to version ${targetVersion}`)

    const nextMigration = migrations.find(x => x.version === targetVersion)
    if (!nextMigration) throw new Error(`Cannot find migration for version ${ targetVersion }`)
    db.exec(nextMigration.up);
    setDatabaseVersion(targetVersion)

    console.groupEnd()
  }

  function downgrade() {
    const currentVersion = getDatabaseVersion()
    const targetVersion = currentVersion - 1

    // console.group(`Downgrading to version ${targetVersion}`)

    const nextMigration = migrations.find(x => x.version === targetVersion)
    if (!nextMigration) throw new Error(`Cannot find migration for version ${ targetVersion }`)
    db.exec(nextMigration.up);
    setDatabaseVersion(targetVersion)

    console.groupEnd()
  }

  function getDatabaseVersion(): number {
    const result = db.prepare('PRAGMA user_version;').get()
    return result['user_version']
  }

  function setDatabaseVersion(version: number): void {
    db.prepare(`PRAGMA user_version = ${ version }`).run()
  }
}
