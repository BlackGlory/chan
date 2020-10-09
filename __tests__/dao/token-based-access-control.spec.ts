import * as TBAC from '@src/dao/token-based-access-control'
import { prepareDatabase } from './utils'
import { Database } from 'better-sqlite3'

jest.mock('@src/dao/database')

describe('TBAC(token-based access control)', () => {
  describe('WriteToken', () => {
    describe('hasWriteTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, token, id, false, true)

          const result = TBAC.hasWriteTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, token, id, true, false)

          const result = TBAC.hasWriteTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('hasReadTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, token, id, true, false)

          const result = TBAC.hasReadTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, token, id, false, true)

          const result = TBAC.hasReadTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('removeWriteToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, token, id, true, true)

          const result = TBAC.removeWriteToken(token, id)
          const row = select(db, token, id)

          expect(result).toBeUndefined()
          expect(row['write_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = TBAC.removeWriteToken(token, id)

          expect(result).toBeUndefined()
          expect(exist(db, token, id)).toBeFalse()
        })
      })
    })
  })

  describe('ReadToken', () => {
    describe('addWriteToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, token, id, true, false)

          const result = TBAC.addWriteToken(token, id)
          const row = select(db, token, id)

          expect(result).toBeUndefined()
          expect(row['write_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = TBAC.addWriteToken(token, id)
          const row = select(db, token, id)

          expect(result).toBeUndefined()
          expect(row['write_permission']).toBe(1)
        })
      })
    })

    describe('addReadToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, token, id, false, true)

          const result = TBAC.addReadToken(token, id)
          const row = select(db, token, id)

          expect(result).toBeUndefined()
          expect(row['read_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = TBAC.addReadToken(token, id)
          const row = select(db, token, id)

          expect(result).toBeUndefined()
          expect(row['read_permission']).toBe(1)
        })
      })
    })

    describe('removeReadToken', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, token, id, true, true)

          const result = TBAC.removeReadToken(token, id)
          const row = select(db, token, id)

          expect(result).toBeUndefined()
          expect(row['read_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = TBAC.removeReadToken(token, id)

          expect(result).toBeUndefined()
          expect(exist(db, token, id)).toBeFalse()
        })
      })
    })
  })
})

function exist(db: Database, token: string, id: string) {
  return !!select(db, token, id)
}

function select(db: Database, token: string, id: string) {
  return db.prepare(`
    SELECT *
      FROM mpmc_tbac
     WHERE token = $token AND mpmc_id = $id;
  `).get({ token, id })
}

function insert(db: Database, token: string, id: string, read: boolean, write: boolean) {
  db.prepare(`
    INSERT INTO mpmc_tbac (token, mpmc_id, read_permission, write_permission)
    VALUES ($token, $id, $read, $write);
  `).run({
    token
  , id
  , read: read ? 1 : 0
  , write: write ? 1 : 0
  })
}
