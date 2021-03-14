import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('GET /admin/whitelist', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/whitelist')
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expect(await toJSON(res)).toMatchSchema({
          type: 'array'
        , items: { type: 'string' }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/whitelist')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/whitelist')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/whitelist/:id', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/whitelist/${id}`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/whitelist/${id}`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/whitelist/${id}`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/whitelist/:id', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/whitelist/${id}`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/whitelist/${id}`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/whitelist/${id}`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })
})

function createAuthHeaders(adminPassword?: string) {
  return {
    'Authorization': `Bearer ${ adminPassword ?? process.env.CHAN_ADMIN_PASSWORD }`
  }
}
