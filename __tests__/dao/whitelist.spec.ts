import * as DAO from '@src/dao/whitelist'
import { Database } from 'better-sqlite3'
import { prepareDatabase } from './utils'
import 'jest-extended'

jest.mock('@src/dao/database')

describe('whitelist', () => {
  describe('getAllWhitelistItems(): string[]', () => {
    it('return string[]', async () => {
      const db = await prepareDatabase()
      const id = 'id-1'
      insert(db, id)

      const result = DAO.getAllWhitelistItems()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id])
    })
  })

  describe('inWhitelist(id: string): boolean', () => {
    describe('exist', () => {
      it('return true', async () => {
        const db = await prepareDatabase()
        const id = 'id-1'
        insert(db, id)

        const result = DAO.inWhitelist(id)

        expect(result).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return false', async () => {
        const db = await prepareDatabase()
        const id = 'id-1'

        const result = DAO.inWhitelist(id)

        expect(result).toBeFalse()
      })
    })
  })

  describe('addWhitelistItem', () => {
    describe('exist', () => {
      it('return undefined', async () => {
        const db = await prepareDatabase()
        const id = 'id-1'
        insert(db, id)

        const result = DAO.addWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', async () => {
        const db = await prepareDatabase()
        const id = 'id-1'

        const result = DAO.addWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeTrue()
      })
    })
  })

  describe('removeWhitelistItem', () => {
    describe('exist', () => {
      it('return undefined', async () => {
        const db = await prepareDatabase()
        const id = 'id-1'
        insert(db, id)

        const result = DAO.removeWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', async () => {
        const db = await prepareDatabase()
        const id = 'id-1'

        const result = DAO.removeWhitelistItem(id)

        expect(result).toBeUndefined()
        expect(exist(db, id)).toBeFalse()
      })
    })
  })
})

function insert(db: Database, id: string) {
  db.prepare('INSERT INTO mpmc_whitelist (mpmc_id) VALUES ($id);').run({ id });
}

function exist(db: Database, id: string) {
  const result = db.prepare(`
    SELECT EXISTS(
             SELECT *
               FROM mpmc_whitelist
              WHERE mpmc_id = $id
           ) AS exist;
  `).get({ id })
  return result.exist === 1
}
