import * as DAO from '@dao/config-in-sqlite3/access-control/token-policy'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawTokenPolicy, hasRawTokenPolicy, setRawTokenPolicy } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('TokenPolicy', () => {
  describe('getAllNamespacesWithTokenPolicies(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      setRawTokenPolicy({
        namespace
      , write_token_required: 1
      , read_token_required: 1
      })

      const result = DAO.getAllNamespacesWithTokenPolicies()

      expect(result).toEqual([namespace])
    })
  })

  describe(`
    getTokenPolicies(namespace: string): {
      writeTokenRequired: boolean | null
      readTokenRequired: boolean | null
    }
  `, () => {
    describe('policy exists', () => {
      it('return', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , write_token_required: 1
        , read_token_required: 1
        })

        const result = DAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          writeTokenRequired: true
        , readTokenRequired: true
        })
      })
    })

    describe('policy does not exist', () => {
      it('return', () => {
        const namespace = 'namespace'

        const result = DAO.getTokenPolicies(namespace)

        expect(result).toEqual({
          writeTokenRequired: null
        , readTokenRequired: null
        })
      })
    })
  })

  describe('setWriteTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setWriteTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['write_token_required']).toBe(1)
    })
  })

  describe('unsetWriteTokenRequired(namespace: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , read_token_required: 1
        , write_token_required: 1
        })

        const result = DAO.unsetWriteTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['write_token_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetWriteTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBeFalse()
      })
    })
  })

  describe('setReadTokenRequired(namespace: string, val: boolean): void', () => {
    it('return undefined', () => {
      const namespace = 'namespace'

      const result = DAO.setReadTokenRequired(namespace, true)
      const row = getRawTokenPolicy(namespace)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['read_token_required']).toBe(1)
    })
  })

  describe('unsetReadTokenRequired(namespace: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        setRawTokenPolicy({
          namespace
        , read_token_required: 1
        , write_token_required: 1
        })

        const result = DAO.unsetReadTokenRequired(namespace)
        const row = getRawTokenPolicy(namespace)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['read_token_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.unsetReadTokenRequired(namespace)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(namespace)).toBeFalse()
      })
    })
  })
})
