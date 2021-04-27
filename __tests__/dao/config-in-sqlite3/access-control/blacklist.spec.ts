import * as DAO from '@dao/config-in-sqlite3/access-control/blacklist'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { hasRawBlacklist, setRawBlacklist } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('blacklist', () => {
  describe('getAllBlacklistItems(): string[]', () => {
    it('return string[]', async () => {
      const namespace = 'namespace'
      setRawBlacklist({ namespace })

      const result = DAO.getAllBlacklistItems()

      expect(result).toEqual([namespace])
    })
  })

  describe('inBlacklist(namespace: string): boolean', () => {
    describe('exist', () => {
      it('return true', async () => {
        const namespace = 'namespace'
        setRawBlacklist({ namespace })

        const result = DAO.inBlacklist(namespace)

        expect(result).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return false', () => {
        const namespace = 'namespace-1'

        const result = DAO.inBlacklist(namespace)

        expect(result).toBeFalse()
      })
    })
  })

  describe('addBlacklistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace-1'
        setRawBlacklist({ namespace })

        const result = DAO.addBlacklistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(namespace)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace-1'

        const result = DAO.addBlacklistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(namespace)).toBeTrue()
      })
    })
  })

  describe('removeBlacklistItem', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace-1'
        setRawBlacklist({ namespace })

        const result = DAO.removeBlacklistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(namespace)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace-1'

        const result = DAO.removeBlacklistItem(namespace)

        expect(result).toBeUndefined()
        expect(hasRawBlacklist(namespace)).toBeFalse()
      })
    })
  })
})
