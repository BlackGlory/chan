import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { ConfigDAO } from '@dao'

jest.mock('@dao/config/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('whitelist', () => {
  describe('id in whitelist', () => {
    it('204', async () => {
      const id = 'id'
      const message = 'message'
      process.env.CHAN_ADMIN_PASSWORD = 'password'
      process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const server = await buildServer()
      await ConfigDAO.addWhitelistItem(id)

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
      process.env.CHAN_ADMIN_PASSWORD = 'password'
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
