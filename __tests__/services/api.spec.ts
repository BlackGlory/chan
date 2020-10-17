import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { tokenSchema } from '@src/schema'

jest.mock('@src/dao/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
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
        process.env.MPMC_ADMIN_PASSWORD = undefined
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
        process.env.MPMC_ADMIN_PASSWORD = undefined
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
        process.env.MPMC_ADMIN_PASSWORD = undefined
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
        process.env.MPMC_ADMIN_PASSWORD = undefined
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
        process.env.MPMC_ADMIN_PASSWORD = undefined
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
        process.env.MPMC_ADMIN_PASSWORD = undefined
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
  describe('GET /api/mpmc', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mpmc'
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
        process.env.MPMC_ADMIN_PASSWORD = undefined
        const server = buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/mpmc'
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
        , url: '/api/mpmc'
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('GET /api/mpmc/:id', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mpmc/${id}`
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
        process.env.MPMC_ADMIN_PASSWORD = undefined
        const server = buildServer()
        const id = 'id'

        const res = await server.inject({
          method: 'GET'
        , url: `/api/mpmc/${id}`
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
        , url: `/api/mpmc/${id}`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mpmc/:id/enqueue/:token', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/enqueue/${token}`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = undefined
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/enqueue/${token}`
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
        , url: `/api/mpmc/${id}/enqueue/${token}`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mpmc/:id/enqueue/:token', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/enqueue/${token}`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = undefined
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/enqueue/${token}`
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
        , url: `/api/mpmc/${id}/enqueue/${token}`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('PUT /api/mpmc/:id/dequeue/:token', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/dequeue/${token}`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = undefined
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/mpmc/${id}/dequeue/${token}`
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
        , url: `/api/mpmc/${id}/dequeue/${token}`
        , headers: createAuthHeaders('bad')
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('DELETE /api/mpmc/:id/dequeue/:token', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/dequeue/${token}`
        , headers: createAuthHeaders()
        })

        expect(res.statusCode).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        process.env.MPMC_ADMIN_PASSWORD = undefined
        const server = buildServer()
        const id = 'id'
        const token = 'token'

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/mpmc/${id}/dequeue/${token}`
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
        , url: `/api/mpmc/${id}/dequeue/${token}`
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
