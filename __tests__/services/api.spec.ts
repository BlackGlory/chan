import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { tokenSchema } from '@src/schema'
import * as JsonSchemaDAO from '@dao/sqlite3/json-schema'

jest.mock('@dao/sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('json schema', () => {
  describe('GET /api/mpmc-with-json-schema', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mpmc-with-json-schema'
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mpmc-with-json-schema'
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mpmc-with-json-schema'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/mpmc/<id>/json-schema', () => {
    describe('auth', () => {
      describe('exist', () => {
        it('200', async () => {
          process.env.MPMC_ADMIN_PASSWORD = 'password'
          const server = buildServer()
          const id = 'id'
          const schema = { type: 'number' }
          JsonSchemaDAO.setJsonSchema({
            id
          , schema: JSON.stringify(schema)
          })

          const res = await server.inject({
            method: 'GET'
          , url: `/api/mpmc/${id}/json-schema`
          , headers: createAuthHeaders()
          })

          expect(res.statusCode).toBe(200)
          expect(res.json()).toEqual(schema)
        })
      })

      describe('not exist', () => {
        it('404', async () => {
          process.env.MPMC_ADMIN_PASSWORD = 'password'
          const server = buildServer()
          const id = 'id'

          const res = await server.inject({
            method: 'GET'
          , url: `/api/mpmc/${id}/json-schema`
          , headers: createAuthHeaders()
          })

          expect(res.statusCode).toBe(404)
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mpmc/${id}/json-schema`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mpmc/${id}/json-schema`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mpmc/<id>/json-schema', () => {
    describe('auth', () => {
      describe('valid JSON', () => {
        it('204', async () => {
          process.env.MPMC_ADMIN_PASSWORD = 'password'
          const server = buildServer()
          const id = 'id'
          const schema = { type: 'number' }

          const res = await server.inject({
            method: 'PUT'
          , url: `/api/mpmc/${id}/json-schema`
          , headers: {
              ...createAuthHeaders()
            , ...createJsonHeaders()
            }
          , payload: schema
          })

          expect(res.statusCode).toBe(204)
        })
      })

      describe('invalid JSON', () => {
        it('400', async () => {
          process.env.MPMC_ADMIN_PASSWORD = 'password'
          const server = buildServer()
          const id = 'id'

          const res = await server.inject({
            method: 'PUT'
          , url: `/api/mpmc/${id}/json-schema`
          , headers: {
              ...createAuthHeaders()
            , ...createJsonHeaders()
            }
          , payload: ''
          })

          expect(res.statusCode).toBe(400)
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()
        const id = 'id'
        const schema = { type: 'number' }

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/json-schema`
        , headers: createJsonHeaders()
        , payload: schema
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const schema = { type: 'number' }

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/json-schema`
        , headers: {
            ...createAuthHeaders('bad')
          , ...createJsonHeaders()
          }
        , payload: schema
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mpmc/<id>/json-schema', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/json-schema`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/json-schema`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/json-schema`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })
})

describe('blacklist', () => {
  describe('GET /api/blacklist', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/blacklist'
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/blacklist'
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/blacklist'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/blacklist/:id', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/blacklist/${id}`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/blacklist/${id}`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/blacklist/${id}`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/blacklist/:id', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/blacklist/${id}`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/blacklist/${id}`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/blacklist/${id}`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })
})

describe('whitelist', () => {
  describe('GET /api/whitelist', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/whitelist'
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/whitelist'
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/whitelist'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/whitelist/:id', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/whitelist/${id}`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/whitelist/${id}`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/whitelist/${id}`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/whitelist/:id', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/whitelist/${id}`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/whitelist/${id}`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = buildServer()

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/whitelist/${id}`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })
})

describe('TBAC', () => {
  describe('GET /api/mpmc-with-tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mpmc-with-tokens'
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mpmc-with-tokens'
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mpmc-with-tokens'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/mpmc/:id/tokens', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mpmc/${id}/tokens`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(200)
        expect(res.json()).toMatchSchema({
          type: 'array'
        , items: {
            type: 'object'
          , properties: {
              token: tokenSchema
            , enqueue: { type: 'boolean' }
            , dequeue: { type: 'boolean' }
            }
          }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mpmc/${id}/tokens`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mpmc/${id}/tokens`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mpmc/:id/tokens/:token/enqueue', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/tokens/${token}/enqueue`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/tokens/${token}/enqueue`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/tokens/${token}/enqueue`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mpmc/:id/tokens/:token/enqueue', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/tokens/${token}/enqueue`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/tokens/${token}/enqueue`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/tokens/${token}/enqueue`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mpmc/:id/tokens/:token/dequeue', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/tokens/${token}/dequeue`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/tokens/${token}/dequeue`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/tokens/${token}/dequeue`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mpmc/:id/tokens/:token/dequeue', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/tokens/${token}/dequeue`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/tokens/${token}/dequeue`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/tokens/${token}/dequeue`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.MPMC_ADMIN_PASSWORD }`
  }
}

function createJsonHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}
