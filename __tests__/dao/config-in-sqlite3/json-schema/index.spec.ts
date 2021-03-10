import * as DAO from '@dao/config-in-sqlite3/json-schema/json-schema'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { hasRawJsonSchema, setRawJsonSchema } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('JSON Schema', () => {
  describe('getAllIdsWithJsonSchema(): string[]', () => {
    it('return string[]', () => {
      const id = 'id-1'
      const schema = createSchema()
      setRawJsonSchema({
        chan_id: id
      , json_schema: schema
      })

      const result = DAO.getAllIdsWithJsonSchema()

      expect(result).toEqual([id])
    })
  })

  describe('getJsonSchema(id: string): string | null', () => {
    describe('exist', () => {
      it('return schema', () => {
        const id = 'id-1'
        const schema = createSchema()
        setRawJsonSchema({
          chan_id: id
        , json_schema: schema
        })

        const result = DAO.getJsonSchema(id)

        expect(result).toBe(schema)
      })
    })

    describe('not exist', () => {
      it('return null', () => {
        const id = 'id-1'

        const result = DAO.getJsonSchema(id)

        expect(result).toBeNull()
      })
    })
  })

  describe('setJsonSchema({ id: string; schema: string })', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        const schema = createSchema()
        setRawJsonSchema({
          chan_id: id
        , json_schema: schema
        })

        const result = DAO.setJsonSchema({ id, schema })

        expect(result).toBeUndefined()
        expect(hasRawJsonSchema(id)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        const schema = createSchema()

        const result = DAO.setJsonSchema({ id, schema })

        expect(result).toBeUndefined()
        expect(hasRawJsonSchema(id)).toBeTrue()
      })
    })
  })

  describe('removeJsonSchema(id: string)', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const id = 'id-1'
        const schema = createSchema()
        setRawJsonSchema({
          chan_id: id
        , json_schema: schema
        })

        const result = DAO.removeJsonSchema(id)

        expect(result).toBeUndefined()
        expect(hasRawJsonSchema(id)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const id = 'id-1'

        const result = DAO.removeJsonSchema(id)

        expect(result).toBeUndefined()
        expect(hasRawJsonSchema(id)).toBeFalse()
      })
    })
  })
})

function createSchema() {
  return JSON.stringify({ type: 'number' })
}
