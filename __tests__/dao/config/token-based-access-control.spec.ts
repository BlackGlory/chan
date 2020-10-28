import * as DAO from '@dao/config/token-based-access-control'
import { prepareDatabase } from '@test/utils'
import { Database } from 'better-sqlite3'
import 'jest-extended'

jest.mock('@dao/config/database')

describe('TBAC(token-based access control)', () => {
  describe('getAllIdsWithTokens(): string[]', () => {
    it('return string[]', async () => {
      const db = await prepareDatabase()
      const id1 = 'id-1'
      const token1 = 'token-1'
      const id2 = 'id-2'
      const token2 = 'token-2'
      insert(db, { token: token1, id: id1, read: true, write: false })
      insert(db, { token: token2, id: id2, read: false, write: true })

      const result = DAO.getAllIdsWithTokens()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id1, id2])
    })
  })

  describe('getAllTokens(id: string): Array<{ token: string; enqueue: boolean; dequeue: boolean }>', () => {
    it('return Array<{ token: string; write: boolean; read: boolean }>', async () => {
      const db = await prepareDatabase()
      const id = 'id-1'
      const token1 = 'token-1'
      const token2 = 'token-2'
      insert(db, { token: token1, id, read: true, write: false })
      insert(db, { token: token2, id, read: false, write: true })

      const result = DAO.getAllTokens(id)

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([
        { token: token1, read: true, write: false }
      , { token: token2, read: false, write: true }
      ])
    })
  })

  describe('WriteToken', () => {
    describe('hasWriteTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: false, write: true })

          const result = DAO.hasWriteTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: false })

          const result = DAO.hasWriteTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchWriteToken({ token: string; id: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: false, write: true })

          const result = DAO.matchWriteToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('token does not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: false })

          const result = DAO.matchWriteToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setWriteToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: false })

          const result = DAO.setWriteToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['write_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setWriteToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['write_permission']).toBe(1)
        })
      })
    })

    describe('unsetWriteToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: true })

          const result = DAO.unsetWriteToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['write_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetWriteToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })

  describe('ReadToken', () => {
    describe('hasReadTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: false })

          const result = DAO.hasReadTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: false, write: true })

          const result = DAO.hasReadTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchReadToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: false })

          const result = DAO.matchReadToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: false, write: true })

          const result = DAO.matchReadToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setReadToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: false, write: true })

          const result = DAO.setReadToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['read_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setReadToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['read_permission']).toBe(1)
        })
      })
    })

    describe('unsetReadToken', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, read: true, write: true })

          const result = DAO.unsetReadToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['read_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetReadToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })
})

function exist(db: Database, { token, id }: { token: string; id: string }) {
  return !!select(db, { token, id })
}

function select(db: Database, { token, id }: { token: string; id: string }) {
  return db.prepare(`
    SELECT *
      FROM mpmc_tbac
     WHERE token = $token AND mpmc_id = $id;
  `).get({ token, id })
}

function insert(
  db: Database
, { token, id, read, write }: {
    token: string
    id: string
    read: boolean
    write: boolean
  }
) {
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
