import { buildServer } from '@src/server'
import { prepareDatabase } from '@test/dao/utils'
import { matchers } from 'jest-json-schema'
import { addBlacklistItem } from '@src/dao/blacklist'
import { addWhitelistItem } from '@src/dao/whitelist'
import {
  setDequeueToken
, setEnqueueToken
} from '@src/dao/token-based-access-control'

jest.mock('@src/dao/database')
expect.extend(matchers)

beforeEach(async () => {
  await prepareDatabase()
  process.env.ADMIN_PASSWORD = undefined
  process.env.LIST_BASED_ACCESS_CONTROL = undefined
  process.env.TOKEN_BASED_ACCESS_CONTROL = undefined
  process.env.DISABLE_NO_TOKENS = undefined
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
          , headers: {
              'Content-Type': 'text/plain'
            }
          , payload: message
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
            const id = 'id'
            const message = 'message'
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'blacklist'
            const server = buildServer()

            setImmediate(() => {
              server.inject({
                method: 'POST'
              , url: `/mpmc/${id}`
              , headers: {
                  'Content-Type': 'text/plain'
                }
              , payload: message
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
            const id = 'id'
            const message = 'message'
            addBlacklistItem(id)
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'blacklist'
            const server = buildServer()

            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , headers: {
                'Content-Type': 'text/plain'
              }
            , payload: message
            })

            expect(res.statusCode).toBe(403)
          })
        })

        describe('id not in blacklist', () => {
          it('204', async () => {
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
            , headers: {
                'Content-Type': 'text/plain'
              }
            , payload: message
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
              , headers: {
                  'Content-Type': 'text/plain'
                }
              , payload: message
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
            , headers: {
                'Content-Type': 'text/plain'
              }
            , payload: message
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('id not in whitelist', () => {
          it('403', async () => {
            const id = 'id'
            const message = 'message'
            process.env.ADMIN_PASSWORD = 'password'
            process.env.LIST_BASED_ACCESS_CONTROL = 'whitelist'
            const server = buildServer()

            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , headers: {
                'Content-Type': 'text/plain'
              }
            , payload: message
            })

            expect(res.statusCode).toBe(403)
          })
        })
      })
    })
  })

  describe('token-based access control', () => {
    describe('GET /mpmc/:id', () => {
      describe('id has dequeue tokens', () => {
        describe('token matched', () => {
          it('200', async () => {
            const id = 'id'
            const token = 'token'
            const message = 'message'
            setDequeueToken({ id, token })
            process.env.ADMIN_PASSWORD = 'password'
            process.env.TOKEN_BASED_ACCESS_CONTROL = 'true'
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
            , query: { token }
            })

            expect(res.statusCode).toBe(200)
            expect(res.body).toBe(message)
          })
        })

        describe('token does not matched', () => {
          it('401', async () => {
            const id = 'id'
            const token = 'token'
            setDequeueToken({ id, token })
            process.env.ADMIN_PASSWORD = 'password'
            process.env.TOKEN_BASED_ACCESS_CONTROL = 'true'
            const server = buildServer()

            const res = await server.inject({
              method: 'GET'
            , url: `/mpmc/${id}`
            , query: { token: 'bad' }
            })

            expect(res.statusCode).toBe(401)
          })
        })
      })

      describe('id does not have dequeue tokens', () => {
        describe('id has enqueue tokens', () => {
          it('200', async () => {
            const id = 'id'
            const token = 'token'
            const message = 'message'
            setEnqueueToken({ id, token })
            process.env.ADMIN_PASSWORD = 'password'
            process.env.TOKEN_BASED_ACCESS_CONTROL = 'true'
            const server = buildServer()

            setImmediate(() => {
              server.inject({
                method: 'POST'
              , url: `/mpmc/${id}`
              , payload: message
              , query: { token }
              , headers: {
                  'Content-Type': 'text/plain'
                }
              })
            })
            const res = await server.inject({
              method: 'GET'
            , url: `/mpmc/${id}`
            , query: { token }
            })

            expect(res.statusCode).toBe(200)
            expect(res.body).toBe(message)
          })
        })

        describe('id has no tokens', () => {
          describe('DISABLE_NO_TOKENS', () => {
            it('403', async () => {
              const id = 'id'
              process.env.ADMIN_PASSWORD = 'password'
              process.env.TOKEN_BASED_ACCESS_CONTROL = 'true'
              process.env.DISABLE_NO_TOKENS = 'true'
              const server = buildServer()

              const res = await server.inject({
                method: 'GET'
              , url: `/mpmc/${id}`
              })

              expect(res.statusCode).toBe(403)
            })
          })

          describe('not DISABLE_NO_TOKENS', () => {
            it('200', async () => {
              const id = 'id'
              const message = 'message'
              process.env.ADMIN_PASSWORD = 'password'
              process.env.TOKEN_BASED_ACCESS_CONTROL = 'true'
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
      })
    })

    describe('POST /mpmc/:id', () => {
      describe('id has enqueue tokens', () => {
        describe('token matched', () => {
          it('204', async () => {
            const id = 'id'
            const token = 'token'
            const message = 'message'
            setEnqueueToken({ id, token })
            process.env.ADMIN_PASSWORD = 'password'
            process.env.TOKEN_BASED_ACCESS_CONTROL = 'true'
            const server = buildServer()

            setImmediate(() => {
              server.inject({
                method: 'GET'
              , url: `/mpmc/${id}`
              , query: { token }
              })
            })
            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , query: { token }
            , headers: {
                'Content-Type': 'text/plain'
              }
            , payload: message
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('token does not matched', () => {
          it('401', async () => {
            const id = 'id'
            const token = 'token'
            const message = 'message'
            setEnqueueToken({ id, token })
            process.env.ADMIN_PASSWORD = 'password'
            process.env.TOKEN_BASED_ACCESS_CONTROL = 'true'
            const server = buildServer()

            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , query: { token: 'bad' }
            , headers: {
                'Content-Type': 'text/plain'
              }
            , payload: message
            })

            expect(res.statusCode).toBe(401)
          })
        })
      })

      describe('id does not have enqueue tokens', () => {
        describe('id has dequeue tokens', () => {
          it('204', async () => {
            const id = 'id'
            const token = 'token'
            const message = 'message'
            setDequeueToken({ id, token })
            process.env.ADMIN_PASSWORD = 'password'
            process.env.TOKEN_BASED_ACCESS_CONTROL = 'true'
            const server = buildServer()

            setImmediate(() => {
              server.inject({
                method: 'GET'
              , url: `/mpmc/${id}`
              , query: { token }
              })
            })
            const res = await server.inject({
              method: 'POST'
            , url: `/mpmc/${id}`
            , headers: {
                'Content-Type': 'text/plain'
              }
            , payload: message
            })

            expect(res.statusCode).toBe(204)
          })
        })

        describe('id has no tokens', () => {
          describe('DISABLE_NO_TOKENS', () => {
            it('403', async () => {
              const id = 'id'
              const message = 'message'
              process.env.ADMIN_PASSWORD = 'password'
              process.env.TOKEN_BASED_ACCESS_CONTROL = 'true'
              process.env.DISABLE_NO_TOKENS = 'true'
              const server = buildServer()

              const res = await server.inject({
                method: 'POST'
              , url: `/mpmc/${id}`
              , headers: {
                  'Content-Type': 'text/plain'
                }
              , payload: message
              })

              expect(res.statusCode).toBe(403)
            })
          })

          describe('not DISABLE_NO_TOKENS', () => {
            it('204', async () => {
              const id = 'id'
              const message = 'message'
              process.env.ADMIN_PASSWORD = 'password'
              process.env.TOKEN_BASED_ACCESS_CONTROL = 'true'
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
              , headers: {
                  'Content-Type': 'text/plain'
                }
              , payload: message
              })

              expect(res.statusCode).toBe(204)
            })
          })
        })
      })
    })
  })
})
