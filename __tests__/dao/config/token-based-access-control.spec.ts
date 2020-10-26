import * as DAO from '@src/dao/config/token-based-access-control'
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
      insert(db, { token: token1, id: id1, dequeue: true, enqueue: false })
      insert(db, { token: token2, id: id2, dequeue: false, enqueue: true })

      const result = DAO.getAllIdsWithTokens()

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([id1, id2])
    })
  })

  describe('getAllTokens(id: string): Array<{ token: string; enqueue: boolean; dequeue: boolean }>', () => {
    it('return Array<{ token: string; enqueue: boolean; dequeue: boolean }>', async () => {
      const db = await prepareDatabase()
      const id = 'id-1'
      const token1 = 'token-1'
      const token2 = 'token-2'
      insert(db, { token: token1, id, dequeue: true, enqueue: false })
      insert(db, { token: token2, id, dequeue: false, enqueue: true })

      const result = DAO.getAllTokens(id)

      // expect.toStrictEqual is broken, I have no idea
      expect(result).toEqual([
        { token: token1, dequeue: true, enqueue: false }
      , { token: token2, dequeue: false, enqueue: true }
      ])
    })
  })

  describe('EnqueueToken', () => {
    describe('hasEnqueueTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: false, enqueue: true })

          const result = DAO.hasEnqueueTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: true, enqueue: false })

          const result = DAO.hasEnqueueTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchEnqueueToken({ token: string; id: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: false, enqueue: true })

          const result = DAO.matchEnqueueToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('token does not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: true, enqueue: false })

          const result = DAO.matchEnqueueToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setEnqueueToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: true, enqueue: false })

          const result = DAO.setEnqueueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['enqueue_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setEnqueueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['enqueue_permission']).toBe(1)
        })
      })
    })

    describe('unsetEnqueueToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: true, enqueue: true })

          const result = DAO.unsetEnqueueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['enqueue_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetEnqueueToken({ token, id })

          expect(result).toBeUndefined()
          expect(exist(db, { token, id })).toBeFalse()
        })
      })
    })
  })

  describe('DequeueToken', () => {
    describe('hasDequeueTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: true, enqueue: false })

          const result = DAO.hasDequeueTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: false, enqueue: true })

          const result = DAO.hasDequeueTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchDequeueToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: true, enqueue: false })

          const result = DAO.matchDequeueToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: false, enqueue: true })

          const result = DAO.matchDequeueToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setDequeueToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: false, enqueue: true })

          const result = DAO.setDequeueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['dequeue_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setDequeueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['dequeue_permission']).toBe(1)
        })
      })
    })

    describe('unsetDequeueToken', () => {
      describe('token exists', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'
          insert(db, { token, id, dequeue: true, enqueue: true })

          const result = DAO.unsetDequeueToken({ token, id })
          const row = select(db, { token, id })

          expect(result).toBeUndefined()
          expect(row['dequeue_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', async () => {
          const db = await prepareDatabase()
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetDequeueToken({ token, id })

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
, { token, id, dequeue, enqueue }: {
    token: string
    id: string
    dequeue: boolean
    enqueue: boolean
  }
) {
  db.prepare(`
    INSERT INTO mpmc_tbac (token, mpmc_id, dequeue_permission, enqueue_permission)
    VALUES ($token, $id, $dequeue, $enqueue);
  `).run({
    token
  , id
  , dequeue: dequeue ? 1 : 0
  , enqueue: enqueue ? 1 : 0
  })
}
