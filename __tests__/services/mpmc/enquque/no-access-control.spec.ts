import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import DAO from '@dao'

jest.mock('@dao/sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('no access control', () => {
  describe('MPMC_JSON_VALIDATION=true', () => {
    describe('MPMC_JSON_DEFAULT_SCHEMA', () => {
      describe('Content-Type: application/json', () => {
        describe('valid', () => {
          it('204', async () => {
            process.env.MPMC_JSON_VALIDATION = 'true'
            process.env.MPMC_DEFAULT_JSON_SCHEMA = JSON.stringify({
              type: 'number'
            })
            const server = buildServer()
            const id = 'id'
            const message = '123'

            setImmediate(() => {
              server.inject({
                method: 'GET'
              , url: `/mpmc/${id}`
              })
            })
            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('invalid', () => {
          it('400', async () => {
            process.env.MPMC_JSON_VALIDATION = 'true'
            process.env.MPMC_DEFAULT_JSON_SCHEMA = JSON.stringify({
              type: 'number'
            })
            const server = buildServer()
            const id = 'id'
            const message = ' "message" '

            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(400)
          })
        })
      })

      describe('other Content-Type', () => {
        it('204', async () => {
          process.env.MPMC_JSON_VALIDATION = 'true'
          process.env.MPMC_DEFAULT_JSON_SCHEMA = JSON.stringify({
            type: 'number'
          })
          const server = buildServer()
          const id = 'id'
          const message = 'message'

          setImmediate(() => {
            server.inject({
              method: 'GET'
            , url: `/mpmc/${id}`
            })
          })
          const res = await server.inject({
            method: 'POST'
          , url: `/mpmc/${id}`
          , payload: message
          , headers: {
              'Content-Type': 'text/plain'
            }
          })

          expect(res.statusCode).toBe(204)
        })
      })
    })

    describe('id has JSON Schema', () => {
      describe('Content-Type: application/json', () => {
        describe('valid JSON', () => {
          it('204', async done => {
            process.env.MPMC_JSON_VALIDATION = 'true'
            const id = 'id'
            const schema = { type: 'string' }
            const message = ' "message" '
            const server = buildServer()
            await DAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })

            setImmediate(async () => {
              const res = await server.inject({
                method: 'GET'
              , url: `/mpmc/${id}`
              })
              expect(res.headers['content-type']).toMatch('application/json')
              expect(res.body).toBe(message)
              done()
            })
            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('invalid JSON', () => {
          it('400', async () => {
            process.env.MPMC_JSON_VALIDATION = 'true'
            const id = 'id'
            const schema = { type: 'string' }
            const message = 'message'
            const server = buildServer()
            await DAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })

            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(400)
          })
        })
      })

      describe('other Content-Type', () => {
        it('400', async () => {
          process.env.MPMC_JSON_VALIDATION = 'true'
          const id = 'id'
          const schema = { type: 'string' }
          const message = ' "message" '
          const server = buildServer()
          await DAO.setJsonSchema({
            id
          , schema: JSON.stringify(schema)
          })

          const res = await server.inject({
            method: 'POST'
          , url: `/mpmc/${id}`
          , payload: message
          , headers: {
              'Content-Type': 'text/plain'
            }
          })

          expect(res.statusCode).toBe(400)
        })
      })
    })

    describe('id does not have JSON Schema', () => {
      describe('Content-Type: application/json', () => {
        describe('valid JSON', () => {
          it('204', async done => {
            process.env.MPMC_JSON_VALIDATION = 'true'
            const id = 'id'
            const schema = { type: 'string' }
            const message = ' "message" '
            const server = buildServer()
            await DAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })

            setImmediate(async () => {
              const res = await server.inject({
                method: 'GET'
              , url: `/mpmc/${id}`
              })
              expect(res.headers['content-type']).toMatch('application/json')
              expect(res.body).toBe(message)
              done()
            })
            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('invalid JSON', () => {
          it('400', async () => {
            process.env.MPMC_JSON_VALIDATION = 'true'
            const id = 'id'
            const message = 'message'
            const server = buildServer()

            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'application/json'
              }
            })

            expect(res.statusCode).toBe(400)
          })
        })
      })
    })
  })

  describe('MPMC_JSON_PAYLOAD_ONLY', () => {
    describe('Content-Type: application/json', () => {
      it('accept any plaintext, return 204', async done => {
        process.env.MPMC_JSON_PAYLOAD_ONLY = 'true'
        const server = buildServer()
        const id = 'id'
        const message = 'message'

        setImmediate(async () => {
          const res = await server.inject({
            method: 'GET'
          , url: `/mpmc/${id}`
          })
          expect(res.headers['content-type']).toMatch('application/json')
          done()
        })
        const res = await server.inject({
          method: 'POST'
        , url: `/mpmc/${id}`
        , payload: message
        , headers: {
            'Content-Type': 'application/json'
          }
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('other Content-Type', () => {
      it('400', async () => {
        process.env.MPMC_JSON_PAYLOAD_ONLY = 'true'
        const server = buildServer()
        const id = 'id'
        const message = 'message'

        const res = await server.inject({
          method: 'POST'
        , url: `/mpmc/${id}`
        , payload: message
        , headers: {
            'Content-Type': 'text/plain'
          }
        })

        expect(res.statusCode).toBe(400)
      })
    })
  })

  describe('Content-Type', () => {
    it('reflect content-type', async done => {
      const server = buildServer()
      const id = 'id'
      const message = 'message'

      setImmediate(async () => {
        const res = await server.inject({
          method: 'GET'
        , url: `/mpmc/${id}`
        })
        expect(res.headers['content-type']).toMatch('apple/banana')
        done()
      })
      const res = await server.inject({
        method: 'POST'
      , url: `/mpmc/${id}`
      , payload: message
      , headers: {
          'Content-Type': 'apple/banana'
        }
      })

      expect(res.statusCode).toBe(204)
    })
  })
})
