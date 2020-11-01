import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/config/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('blacklist', () => {
  describe('GET /api/blacklist', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

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
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: '/api/blacklist'
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

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
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = await buildServer()

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
        const server = await buildServer()

        const res = await server.inject({
          method: 'PUT'
        , url: `/api/blacklist/${id}`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = await buildServer()

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
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = await buildServer()

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
        const server = await buildServer()

        const res = await server.inject({
          method: 'DELETE'
        , url: `/api/blacklist/${id}`
        })

        expect(res.statusCode).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const server = await buildServer()

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

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.CHAN_ADMIN_PASSWORD }`
  }
}
