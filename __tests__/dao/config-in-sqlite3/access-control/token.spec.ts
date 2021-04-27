import * as DAO from '@dao/config-in-sqlite3/access-control/token'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawToken, hasRawToken, setRawToken } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('token-based access control', () => {
  describe('getAllNamespacesWithTokens(): string[]', () => {
    it('return string[]', () => {
      const namespace1 = 'namespace-1'
      const token1 = 'token-1'
      const namespace = 'namespace-2'
      const token2 = 'token-2'
      setRawToken({
        token: token1
      , namespace: namespace1
      , read_permission: 1
      , write_permission: 0
      })
      setRawToken({
        token: token2
      , namespace
      , read_permission: 0
      , write_permission: 1
      })

      const result = DAO.getAllIdsWithTokens()

      expect(result).toEqual([namespace1, namespace])
    })
  })

  describe(`
    getAllTokens(namespace: string): Array<{
      token: string
      enqueue: boolean
      dequeue: boolean
    }>
  `, () => {
    it('return Array<{ token: string; write: boolean; read: boolean }>', () => {
      const namespace = 'namespace'
      const token1 = 'token-1'
      const token2 = 'token-2'
      setRawToken({
        token: token1
      , namespace
      , read_permission: 1
      , write_permission: 0
      })
      setRawToken({
        token: token2
      , namespace
      , read_permission: 0
      , write_permission: 1
      })

      const result = DAO.getAllTokens(namespace)

      expect(result).toEqual([
        { token: token1, read: true, write: false }
      , { token: token2, read: false, write: true }
      ])
    })
  })

  describe('WriteToken', () => {
    describe('hasWriteTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          })

          const result = DAO.hasWriteTokens(namespace)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          })

          const result = DAO.hasWriteTokens(namespace)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchWriteToken({ token: string; namespace: string }): boolean', () => {
      describe('token exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          })

          const result = DAO.matchWriteToken({ token, namespace })

          expect(result).toBeTrue()
        })
      })

      describe('token does not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          })

          const result = DAO.matchWriteToken({ token, namespace })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setWriteToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          })

          const result = DAO.setWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.setWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(1)
        })
      })
    })

    describe('unsetWriteToken({ token: string; namespace: string })', () => {
      describe('token exists', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 1
          })

          const result = DAO.unsetWriteToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['write_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.unsetWriteToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBeFalse()
        })
      })
    })
  })

  describe('ReadToken', () => {
    describe('hasReadTokens(namespace: string): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0
          })

          const result = DAO.hasReadTokens(namespace)

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          })

          const result = DAO.hasReadTokens(namespace)

          expect(result).toBeFalse()
        })
      })
    })

    describe('matchReadToken({ token: string; namespace: string }): boolean', () => {
      describe('tokens exist', () => {
        it('return true', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 0 })

          const result = DAO.matchReadToken({ token, namespace })

          expect(result).toBeTrue()
        })
      })

      describe('tokens do not exist', () => {
        it('return false', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1
          })

          const result = DAO.matchReadToken({ token, namespace })

          expect(result).toBeFalse()
        })
      })
    })

    describe('setReadToken(token: string, namespace: string)', () => {
      describe('token exists', () => {
        it('update row', () => {
          const token = 'token-1'
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 0
          , write_permission: 1 })

          const result = DAO.setReadToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(1)
        })
      })

      describe('token does not exist', () => {
        it('insert row', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.setReadToken({ token, namespace })
          const row = getRawToken(token, namespace)

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
          const namespace = 'namespace'
          setRawToken({
            token
          , namespace
          , read_permission: 1
          , write_permission: 1
          })

          const result = DAO.unsetReadToken({ token, namespace })
          const row = getRawToken(token, namespace)

          expect(result).toBeUndefined()
          expect(row).not.toBeNull()
          expect(row!['read_permission']).toBe(0)
        })
      })

      describe('token does not exist', () => {
        it('return undefined', () => {
          const token = 'token-1'
          const namespace = 'namespace'

          const result = DAO.unsetReadToken({ token, namespace })

          expect(result).toBeUndefined()
          expect(hasRawToken(token, namespace)).toBeFalse()
        })
      })
    })
  })
})
