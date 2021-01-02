import * as DAO from '@dao/config-in-sqlite3/access-control/blacklist'
import { getDatabase } from '@dao/config-in-sqlite3/database'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { Database } from 'better-sqlite3'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('blacklist', () => {
  describe('getAllBlacklistItems(): string[]', () => {
    it('return string[]', () => {
      const db = getDatabase()
      const id = 'id-1'
      insert(db, id)

      const result = DAO.getAllBlacklistItems()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id])
    })
  })

  describe('inBlacklist(id: string): boolean', () => {
    describe('exist', () => {
      it('return true', () => {
        const db = getDatabase()
        const id = 'id-1'
        insert(db, id)

        const result = DAO.inBlacklist(id)

        expect(result).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return false', () => {
        const id = 'id-1'

        const result = DAO.inBlacklist(id)

        expect(result).toBeFalse()
      })
    })
  })

  describe('addBlacklistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id-1'
        insert(db, id)

        const result = DAO.addBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id-1'

        const result = DAO.addBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeTrue()
      })
    })
  })

  describe('removeBlacklistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id-1'
        insert(db, id)

        const result = DAO.removeBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const db = getDatabase()
        const id = 'id-1'

        const result = DAO.removeBlacklistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })
})

function exist(db: Database, id: string) {
  return !!select(db, id)
}

function insert(db: Database, id: string) {
  db.prepare('INSERT INTO chan_blacklist (chan_id) VALUES ($id);').run({ id });
}

function select(db: Database, id: string) {
  return db.prepare('SELECT * FROM chan_blacklist WHERE chan_id = $id;').get({ id })
}
