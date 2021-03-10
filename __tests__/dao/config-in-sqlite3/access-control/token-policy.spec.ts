import * as DAO from '@dao/config-in-sqlite3/access-control/token-policy'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { getRawTokenPolicy, hasRawTokenPolicy, setRawTokenPolicy } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('TokenPolicy', () => {
  describe('getAllIdsWithTokenPolicies(): string[]', () => {
    it('return string[]', () => {
      const id = 'id'
      setRawTokenPolicy({
        chan_id: id
      , write_token_required: 1
      , read_token_required: 1
      })

      const result = DAO.getAllIdsWithTokenPolicies()

      expect(result).toEqual([id])
    })
  })

  describe('getTokenPolicies(id: string): { writeTokenRequired: boolean | null, readTokenRequired: boolean | null', () => {
    describe('policy exists', () => {
      it('return', () => {
        const id = 'id'
        setRawTokenPolicy({
          chan_id: id
        , write_token_required: 1
        , read_token_required: 1
        })

        const result = DAO.getTokenPolicies(id)

        expect(result).toEqual({
          writeTokenRequired: true
        , readTokenRequired: true
        })
      })
    })

    describe('policy does not exist', () => {
      it('return', () => {
        const id = 'id'

        const result = DAO.getTokenPolicies(id)

        expect(result).toEqual({
          writeTokenRequired: null
        , readTokenRequired: null
        })
      })
    })
  })

  describe('setWriteTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setWriteTokenRequired(id, true)
      const row = getRawTokenPolicy(id)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['write_token_required']).toBe(1)
    })
  })

  describe('unsetWriteTokenRequired(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setRawTokenPolicy({
          chan_id: id
        , read_token_required: 1
        , write_token_required: 1
        })

        const result = DAO.unsetWriteTokenRequired(id)
        const row = getRawTokenPolicy(id)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['write_token_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetWriteTokenRequired(id)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(id)).toBeFalse()
      })
    })
  })

  describe('setReadTokenRequired(id: string, val: boolean): void', () => {
    it('return undefined', () => {
      const id = 'id'

      const result = DAO.setReadTokenRequired(id, true)
      const row = getRawTokenPolicy(id)

      expect(result).toBeUndefined()
      expect(row).not.toBeNull()
      expect(row!['read_token_required']).toBe(1)
    })
  })

  describe('unsetReadTokenRequired(id: string): void', () => {
    describe('policy exists', () => {
      it('return undefined', () => {
        const id = 'id'
        setRawTokenPolicy({
          chan_id: id
        , read_token_required: 1
        , write_token_required: 1
        })

        const result = DAO.unsetReadTokenRequired(id)
        const row = getRawTokenPolicy(id)

        expect(result).toBeUndefined()
        expect(row).not.toBeNull()
        expect(row!['read_token_required']).toBeNull()
      })
    })

    describe('policy does not exist', () => {
      it('return undefined', () => {
        const id = 'id'

        const result = DAO.unsetReadTokenRequired(id)

        expect(result).toBeUndefined()
        expect(hasRawTokenPolicy(id)).toBeFalse()
      })
    })
  })
})
