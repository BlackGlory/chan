import { buildServer } from '@src/server'
import { prepareDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabases()
})

describe('whitelist', () => {
  describe('enabled', () => {
    describe('id in whitelist', () => {
      it('204', async () => {
        const id = 'id'
        const message = 'message'
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const server = await buildServer()
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
        const server = await buildServer()

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
        const server = await buildServer()

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
