import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { JsonSchemaDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get, put, del } from 'extra-request'
import { url, pathname, headers, json, text, header } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('json schema', () => {
  describe('GET /admin/chan-with-json-schema', () => {
    describe('auth', () => {
      it('200', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'

        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/chan-with-json-schema')
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
        , pathname('/admin/chan-with-json-schema')
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const res = await fetch(get(
          url(getAddress())
        , pathname('/admin/chan-with-json-schema')
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('GET /admin/chan/<id>/json-schema', () => {
    describe('auth', () => {
      describe('exist', () => {
        it('200', async () => {
          process.env.CHAN_ADMIN_PASSWORD = 'password'
          const id = 'id'
          const schema = { type: 'number' }
          await JsonSchemaDAO.setJsonSchema({
            id
          , schema: JSON.stringify(schema)
          })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/admin/chan/${id}/json-schema`)
          , headers(createAuthHeaders())
          ))

          expect(res.status).toBe(200)
          expect(await toJSON(res)).toEqual(schema)
        })
      })

      describe('not exist', () => {
        it('404', async () => {
          process.env.CHAN_ADMIN_PASSWORD = 'password'
          const id = 'id'

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/admin/chan/${id}/json-schema`)
          , headers(createAuthHeaders())
          ))

          expect(res.status).toBe(404)
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/admin/chan/${id}/json-schema`)
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
        , pathname(`/admin/chan/${id}/json-schema`)
        , headers(createAuthHeaders('bad'))
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('PUT /admin/chan/<id>/json-schema', () => {
    describe('auth', () => {
      describe('valid JSON', () => {
        it('204', async () => {
          process.env.CHAN_ADMIN_PASSWORD = 'password'
          const id = 'id'
          const schema = { type: 'number' }

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/admin/chan/${id}/json-schema`)
          , headers(createAuthHeaders())
          , json(schema)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('invalid JSON', () => {
        it('400', async () => {
          process.env.CHAN_ADMIN_PASSWORD = 'password'
          const id = 'id'

          const res = await fetch(put(
            url(getAddress())
          , pathname(`/admin/chan/${id}/json-schema`)
          , headers(createAuthHeaders())
          , text('')
          , header('Content-Type', 'application/json')
          ))

          expect(res.status).toBe(400)
        })
      })
    })

    describe('no admin password', () => {
      it('401', async () => {
        const id = 'id'
        const schema = { type: 'number' }

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/chan/${id}/json-schema`)
        , json(schema)
        ))

        expect(res.status).toBe(401)
      })
    })

    describe('bad auth', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'
        const schema = { type: 'number' }

        const res = await fetch(put(
          url(getAddress())
        , pathname(`/admin/chan/${id}/json-schema`)
        , headers(createAuthHeaders('bad'))
        , json(schema)
        ))

        expect(res.status).toBe(401)
      })
    })
  })

  describe('DELETE /admin/chan/<id>/json-schema', () => {
    describe('auth', () => {
      it('204', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        const id = 'id'

        const res = await fetch(del(
          url(getAddress())
        , pathname(`/admin/chan/${id}/json-schema`)
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
        , pathname(`/admin/chan/${id}/json-schema`)
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
        , pathname(`/admin/chan/${id}/json-schema`)
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
