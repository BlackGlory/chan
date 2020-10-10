import { buildServer } from '@src/server'
import { prepareDatabase } from '@test/dao/utils'
import { matchers } from 'jest-json-schema'
import { addBlacklistItem } from '@src/dao/blacklist'
import { addWhitelistItem } from '@src/dao/whitelist'

jest.mock('@src/dao/database')
expect.extend(matchers)

beforeEach(async () => {
  await prepareDatabase()
})

describe('mpmc', () => {
  describe('no access control', () => {
    describe('GET /mpmc/:id', () => {
      it('200', async () => {
        process.env.ADMIN_PASSWORD = undefined
        const server = buildServer()
        const id = 'id'
        const message = 'message'

        setImmediate(() => {
          server.inject({
            method: 'POST'
          , url: `/mpmc/${id}`
          , payload: message
          , headers: {
              'Content-Type': 'text/plain'
            }
          })
        })
        const res = await server.inject({
          method: 'GET'
        , url: `/mpmc/${id}`
        })

        expect(res.statusCode).toBe(200)
        expect(res.body).toBe(message)
      })
    })

    describe('POST /mpmc/:id', () => {
      it('204', async () => {
        process.env.ADMIN_PASSWORD = undefined
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

  describe('list-based access control', () => {
    describe('blackllist', () => {
      describe('GET /mpmc/:id', () => {
        describe('id in blacklist', () => {
          it('403', async () => {
            await prepareDatabase()
            const id = 'id'
            addBlacklistItem(id)
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'blacklist'
            const server = buildServer()

            const res = await server.inject({
              method: 'GET'
            , url: `/mpmc/${id}`
            })

            expect(res.statusCode).toBe(403)
          })
        })

        describe('id not in blacklist', () => {
          it('200', async () => {
            await prepareDatabase()
            const id = 'id'
            const message = 'message'
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'blacklist'
            const server = buildServer()

            setImmediate(() => {
              server.inject({
                method: 'POST'
              , url: `/mpmc/${id}`
              , payload: message
              , headers: {
                  'Content-Type': 'text/plain'
                }
              })
            })
            const res = await server.inject({
              method: 'GET'
            , url: `/mpmc/${id}`
            })

            expect(res.statusCode).toBe(200)
            expect(res.body).toBe(message)
          })
        })
      })

      describe('POST /mpmc/:id', () => {
        describe('id in blacklist', () => {
          it('403', async () => {
            await prepareDatabase()
            const id = 'id'
            const message = 'message'
            addBlacklistItem(id)
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'blacklist'
            const server = buildServer()

            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'text/plain'
              }
            })

            expect(res.statusCode).toBe(403)
          })
        })

        describe('id not in blacklist', () => {
          it('204', async () => {
            await prepareDatabase()
            const id = 'id'
            const message = 'message'
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'blacklist'
            const server = buildServer()

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
    })

    describe('whitelist', () => {
      describe('GET /mpmc/:id', () => {
        describe('id in whitelist', () => {
          it('200', async () => {
            await prepareDatabase()
            const id = 'id'
            const message = 'message'
            addWhitelistItem(id)
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'whitelist'
            const server = buildServer()

            setImmediate(() => {
              server.inject({
                method: 'POST'
              , url: `/mpmc/${id}`
              , payload: message
              , headers: {
                  'Content-Type': 'text/plain'
                }
              })
            })
            const res = await server.inject({
              method: 'GET'
            , url: `/mpmc/${id}`
            })

            expect(res.statusCode).toBe(200)
            expect(res.body).toBe(message)
          })
        })

        describe('id not in whitelist', () => {
          it('403', async () => {
            await prepareDatabase()
            const id = 'id'
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'whitelist'
            const server = buildServer()

            const res = await server.inject({
              method: 'GET'
            , url: `/mpmc/${id}`
            })

            expect(res.statusCode).toBe(403)
          })
        })
      })

      describe('POST /mpmc/:id', () => {
        describe('id in whitelist', () => {
          it('204', async () => {
            await prepareDatabase()
            const id = 'id'
            const message = 'message'
            addWhitelistItem(id)
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'whitelist'
            const server = buildServer()

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

        describe('id not in whitelist', () => {
          it('403', async () => {
            await prepareDatabase()
            const id = 'id'
            const message = 'message'
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'whitelist'
            const server = buildServer()

            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'text/plain'
              }
            })

            expect(res.statusCode).toBe(403)
          })
        })
      })
    })
  })
})
