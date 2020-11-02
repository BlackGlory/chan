import { buildServer } from '@src/server'
import { prepareAccessControlDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/access-control/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareAccessControlDatabase()
})

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('200', async () => {
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        const message = 'message'
        const server = await buildServer()
        await AccessControlDAO.addWhitelistItem(id)

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

    describe('id not in whitelist', () => {
      it('403', async () => {
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const id = 'id'
        const server = await buildServer()

        const res = await server.inject({
          method: 'GET'
        , url: `/chan/${id}`
        })

        expect(res.statusCode).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('id not in whitelist', () => {
      it('403', async () => {
        const id = 'id'
        const message = 'message'
        const server = await buildServer()
        await AccessControlDAO.addWhitelistItem(id)

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
