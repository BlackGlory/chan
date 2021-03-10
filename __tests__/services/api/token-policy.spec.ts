import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers, json } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('TokenPolicy', () => {
  describe('GET /api/chan-with-token-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/api/chan-with-token-policies')
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
        , pathname('/api/chan-with-token-policies')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/api/chan-with-token-policies')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /api/chan/:id/token-policies', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies`)
        , headers(createAuthHeaders())
        ))

        expect(res.status).toBe(200)
        expect(toJSON(res)).toMatchSchema({
          type: 'object'
        , properties: {
            writeTokenRequired: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          , readTokenRequired: {
              oneOf: [
                { type: 'boolean' }
              , { type: 'null' }
              ]
            }
          }
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies`)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /api/chan/:id/token-policies/write-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies/write-token-required`)
        , headers(createJsonHeaders())
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies/write-token-required`)
        , headers(createJsonHeaders())
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies/write-token-required`)
        , headers(createJsonHeaders())
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /api/chan/:id/token-policies/read-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies/read-token-required`)
        , headers(createJsonHeaders())
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies/read-token-required`)
        , headers(createJsonHeaders())
        , headers(createAuthHeaders())
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const val = true

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies/read-token-required`)
        , headers(createJsonHeaders())
        , headers(createAuthHeaders('bad'))
        , json(val)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/chan/:id/token-policies/write-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies/write-token-required`)
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
        , pathname(`/api/chan/${id}/token-policies/write-token-required`)
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
        , pathname(`/api/chan/${id}/token-policies/write-token-required`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /api/chan/:id/token-policies/read-token-required', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/api/chan/${id}/token-policies/read-token-required`)
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
        , pathname(`/api/chan/${id}/token-policies/read-token-required`)
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
        , pathname(`/api/chan/${id}/token-policies/read-token-required`)
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

function createJsonHeaders() {
  return {
    'Content-Type': 'application/json'
  }
}
