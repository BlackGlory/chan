import * as DAO from '@dao/config-in-sqlite3/access-control/token'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawToken, hasRawToken, setRawToken } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('token-based access control', () => {
  describe('getAllIdsWithTokens(): string[]', () => {
    it('return string[]', () => {
      const id1 = 'id-1'
      const token1 = 'token-1'
      const id2 = 'id-2'
      const token2 = 'token-2'
      setRawToken({
        token: token1
      , chan_id: id1
      , read_permission: 1
      , write_permission: 0
      })
      setRawToken({
        token: token2
      , chan_id: id2
      , read_permission: 0
      , write_permission: 1
      })

      const result = DAO.getAllIdsWithTokens()

      expect(result).toEqual([id1, id2])
    })
  })

  describe('getAllTokens(id: string): Array<{ token: string; enqueue: boolean; dequeue: boolean }>', () => {
    it('return Array<{ token: string; write: boolean; read: boolean }>', () => {
      const id = 'id-1'
      const token1 = 'token-1'
      const token2 = 'token-2'
      setRawToken({
        token: token1
      , chan_id: id
      , read_permission: 1
      , write_permission: 0
      })
      setRawToken({
        token: token2
      , chan_id: id
      , read_permission: 0
      , write_permission: 1
      })

      const result = DAO.getAllTokens(id)

      expect(result).toEqual([
        { token: token1, read: true, write: false }
      , { token: token2, read: false, write: true }
      ])
    })
  })

  describe('WriteToken', () => {
    describe('hasWriteTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 0
          , write_permission: 1
          })

          const result = DAO.hasWriteTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 1
          , write_permission: 0
          })

          const result = DAO.hasWriteTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchWriteToken({ token: string; id: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 0
          , write_permission: 1
          })

          const result = DAO.matchWriteToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('token does not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 1
          , write_permission: 0
          })

          const result = DAO.matchWriteToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setWriteToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 1
          , write_permission: 0
          })

          const result = DAO.setWriteToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setWriteToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(1)
        })
      })
    })

    describe('unsetWriteToken({ token: string; id: string })', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 1
          , write_permission: 1
          })

          const result = DAO.unsetWriteToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetWriteToken({ token, id })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, id)).toBeFalse()
        })
      })
    })
  })

  describe('ReadToken', () => {
    describe('hasReadTokens(id: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 1
          , write_permission: 0
          })

          const result = DAO.hasReadTokens(id)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 0
          , write_permission: 1
          })

          const result = DAO.hasReadTokens(id)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchReadToken({ token: string; id: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 1
          , write_permission: 0 })

          const result = DAO.matchReadToken({ token, id })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 0
          , write_permission: 1
          })

          const result = DAO.matchReadToken({ token, id })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setReadToken(token: string, id: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 0
          , write_permission: 1 })

          const result = DAO.setReadToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.setReadToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(1)
        })
      })
    })

    describe('unsetReadToken', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const id = 'id-1'
          setRawToken({
            token
          , chan_id: id
          , read_permission: 1
          , write_permission: 1
          })

          const result = DAO.unsetReadToken({ token, id })
          const row = getRawToken(token, id)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const id = 'id-1'

          const result = DAO.unsetReadToken({ token, id })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, id)).toBeFalse()
        })
      })
    })
  })
})
