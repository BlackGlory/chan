import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { addBlacklistItem } from '@src/dao/blacklist'
import { addWhitelistItem } from '@src/dao/whitelist'
import { setJsonSchema } from '@src/dao/json-schema'
import {
  setDequeueToken
, setEnqueueToken
} from '@src/dao/token-based-access-control'

jest.mock('@src/dao/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('mpmc', () => {
  describe('no access control', () => {
    describe('GET /mpmc/:id', () => {
      it('200', async () => {
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
      describe('MPMC_JSON_SCHEMA_VALIDATION=true', () => {
        describe('MPMC_JSON_DEFAULT_SCHEMA', () => {
          describe('Content-Type: application/json', () => {
            describe('valid', () => {
              it('204', async () => {
                process.env.MPMC_JSON_SCHEMA_VALIDATION = 'true'
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
                process.env.MPMC_JSON_SCHEMA_VALIDATION = 'true'
                process.env.MPMC_DEFAULT_JSON_SCHEMA = JSON.stringify({
                  type: 'number'
                })
                const server = buildServer()
                const id = 'id'
                const message = '"message"'

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

                expect(res.statusCode).toBe(400)
              })
            })
          })

          describe('other Content-Type', () => {
            it('204', async () => {
              process.env.MPMC_JSON_SCHEMA_VALIDATION = 'true'
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
                process.env.MPMC_JSON_SCHEMA_VALIDATION = 'true'
                const id = 'id'
                const schema = { type: 'string' }
                setJsonSchema({
                  id
                , schema: JSON.stringify(schema)
                })
                const message = '"message"'
                const server = buildServer()

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

            describe('invalid JSON', () => {
              it('400', async () => {
                process.env.MPMC_JSON_SCHEMA_VALIDATION = 'true'
                const id = 'id'
                const schema = { type: 'string' }
                setJsonSchema({
                  id
                , schema: JSON.stringify(schema)
                })
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

          describe('other Content-Type', () => {
            it('400', async () => {
              process.env.MPMC_JSON_SCHEMA_VALIDATION = 'true'
              const id = 'id'
              const schema = { type: 'string' }
              setJsonSchema({
                id
              , schema: JSON.stringify(schema)
              })
              const message = '"message"'
              const server = buildServer()

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
      })

      describe('MPMC_JSON_PAYLOAD_ONLY', () => {
        describe('Content-Type: application/json', () => {
          describe('valid JSON', () => {
            it('204', async done => {
              process.env.MPMC_JSON_PAYLOAD_ONLY = 'true'
              const server = buildServer()
              const id = 'id'
              const message = JSON.stringify('message')

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

          describe('invalid JSON', () => {
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
                  'Content-Type': 'application/json'
                }
              })

              expect(res.statusCode).toBe(400)
            })
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

      describe('other', () => {
        describe('Content-Type: application/json', () => {
          describe('valid JSON', () => {
            it('204', async done => {
              const id = 'id'
              const message = '"message"'
              const server = buildServer()

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

          describe('invalid JSON', () => {
            it('400', async () => {
              const server = buildServer()
              const id = 'id'
              const message = 'message'

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
          it('204', async done => {
            const server = buildServer()
            const id = 'id'
            const message = 'message'

            setImmediate(async () => {
              const res = await server.inject({
                method: 'GET'
              , url: `/mpmc/${id}`
              })
              expect(res.headers['content-type']).toMatch('text/plain')
              done()
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
  })

  describe('list-based access control', () => {
    describe('blackllist', () => {
      describe('GET /mpmc/:id', () => {
        describe('id in blacklist', () => {
          it('403', async () => {
            const id = 'id'
            addBlacklistItem(id)
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'whitelist'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'whitelist'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'whitelist'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'whitelist'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
              process.env.MPMC_ADMIN_PASSWORD = 'password'
              process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL = 'true'
              process.env.MPMC_DISABLE_NO_TOKENS = 'true'
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
              process.env.MPMC_ADMIN_PASSWORD = 'password'
              process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
            process.env.MPMC_ADMIN_PASSWORD = 'password'
            process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
              process.env.MPMC_ADMIN_PASSWORD = 'password'
              process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL = 'true'
              process.env.MPMC_DISABLE_NO_TOKENS = 'true'
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
              process.env.MPMC_ADMIN_PASSWORD = 'password'
              process.env.MPMC_TOKEN_BASED_ACCESS_CONTROL = 'true'
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
