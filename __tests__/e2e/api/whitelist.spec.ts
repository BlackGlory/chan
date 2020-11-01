import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/config/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('whitelist', () => {
  describe('GET /api/whitelist', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.MPMC_ADMIN_PASSWORD = 'password'
        const server = await buildServer()

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
        const server = await buildServer()

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
        const server = await buildServer()

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
        const server = await buildServer()

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
        const server = await buildServer()

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
        const server = await buildServer()

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
        const server = await buildServer()

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
        const server = await buildServer()

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
        const server = await buildServer()

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

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.MPMC_ADMIN_PASSWORD }`
  }
}
