import * as DAO from '@dao/config-in-sqlite3/json-schema/json-schema'
import { initializeDatabases, clearDatabases } from '@test/utils'
import { hasRawJsonSchema, setRawJsonSchema } from './utils'
import 'jest-extended'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(initializeDatabases)
afterEach(clearDatabases)

describe('JSON Schema', () => {
  describe('getAllNamespacesWithJsonSchema(): string[]', () => {
    it('return string[]', () => {
      const namespace = 'namespace'
      const schema = createSchema()
      setRawJsonSchema({
        namespace
      , json_schema: schema
      })

      const result = DAO.getAllNamespacesWithJsonSchema()

      expect(result).toEqual([namespace])
    })
  })

  describe('getJsonSchema(namespace: string): string | null', () => {
    describe('exist', () => {
      it('return schema', () => {
        const namespace = 'namespace'
        const schema = createSchema()
        setRawJsonSchema({
          namespace
        , json_schema: schema
        })

        const result = DAO.getJsonSchema(namespace)

        expect(result).toBe(schema)
      })
    })

    describe('not exist', () => {
      it('return null', () => {
        const namespace = 'namespace'

        const result = DAO.getJsonSchema(namespace)

        expect(result).toBeNull()
      })
    })
  })

  describe('setJsonSchema({ namespace: string; schema: string })', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        const schema = createSchema()
        setRawJsonSchema({
          namespace
        , json_schema: schema
        })

        const result = DAO.setJsonSchema({ namespace, schema })

        expect(result).toBeUndefined()
        expect(hasRawJsonSchema(namespace)).toBeTrue()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        const schema = createSchema()

        const result = DAO.setJsonSchema({ namespace, schema })

        expect(result).toBeUndefined()
        expect(hasRawJsonSchema(namespace)).toBeTrue()
      })
    })
  })

  describe('removeJsonSchema(namespace: string)', () => {
    describe('exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'
        const schema = createSchema()
        setRawJsonSchema({
          namespace
        , json_schema: schema
        })

        const result = DAO.removeJsonSchema(namespace)

        expect(result).toBeUndefined()
        expect(hasRawJsonSchema(namespace)).toBeFalse()
      })
    })

    describe('not exist', () => {
      it('return undefined', () => {
        const namespace = 'namespace'

        const result = DAO.removeJsonSchema(namespace)

        expect(result).toBeUndefined()
        expect(hasRawJsonSchema(namespace)).toBeFalse()
      })
    })
  })
})

function createSchema() {
  return JSON.stringify({ type: 'number' })
}
