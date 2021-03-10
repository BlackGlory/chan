import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('204', async () => {
        const id = 'id'
        const message = 'message'
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const server = getServer()
        await AccessControlDAO.addWhitelistItem(id)

        setImmediate(() => {
          server.inject({
            method: 'GET'
          , url: `/chan/${id}`
          })
        })
        const res = await server.inject({
          method: 'POST'
        , url: `/chan/${id}`
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
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        const message = 'message'
        const server = getServer()

        const res = await server.inject({
          method: 'POST'
        , url: `/chan/${id}`
        , headers: {
            'Content-Type': 'text/plain'
          }
        , payload: message
        })

        expect(res.statusCode).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('204', async () => {
        const id = 'id'
        const message = 'message'
        const server = getServer()

        setImmediate(() => {
          server.inject({
            method: 'GET'
          , url: `/chan/${id}`
          })
        })
        const res = await server.inject({
          method: 'POST'
        , url: `/chan/${id}`
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
