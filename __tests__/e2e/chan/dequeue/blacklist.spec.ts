import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('blackllist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        const server = await buildServer()
        await AccessControlDAO.addBlacklistItem(id)

        const res = await server.inject({
          method: 'GET'
        , url: `/chan/${id}`
        })

        expect(res.statusCode).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('200', async () => {
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        const message = 'message'
        const server = await buildServer()

        setImmediate(() => {
          server.inject({
            method: 'POST'
          , url: `/chan/${id}`
          , headers: {
              'Content-Type': 'text/plain'
            }
          , payload: message
          })
        })
        const res = await server.inject({
          method: 'GET'
        , url: `/chan/${id}`
        })

        expect(res.statusCode).toBe(200)
        expect(res.body).toBe(message)
      })
    })
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('200', async () => {
        const id = 'id'
        const message = 'message'
        const server = await buildServer()
        await AccessControlDAO.addBlacklistItem(id)

        setImmediate(() => {
          server.inject({
            method: 'POST'
          , url: `/chan/${id}`
          , headers: {
              'Content-Type': 'text/plain'
            }
          , payload: message
          })
        })
        const res = await server.inject({
          method: 'GET'
        , url: `/chan/${id}`
        })

        expect(res.statusCode).toBe(200)
        expect(res.body).toBe(message)
      })
    })
  })
})
