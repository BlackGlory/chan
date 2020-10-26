import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { DAO } from '@dao'

jest.mock('@dao/config/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('blackllist', () => {
  describe('id in blacklist', () => {
    it('403', async () => {
      process.env.MPMC_ADMIN_PASSWORD = 'password'
      process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'blacklist'
      const id = 'id'
      const server = await buildServer()
      await DAO.addBlacklistItem(id)

      const res = await server.inject({
        method: 'GET'
      , url: `/mpmc/${id}`
      })

      expect(res.statusCode).toBe(403)
    })
  })

  describe('id not in blacklist', () => {
    it('200', async () => {
      process.env.MPMC_ADMIN_PASSWORD = 'password'
      process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'blacklist'
      const id = 'id'
      const message = 'message'
      const server = await buildServer()

      setImmediate(() => {
        server.inject({
          method: 'POST'
        , url: `/mpmc/${id}`
        , headers: {
            'Content-Type': 'text/plain'
          }
        , payload: message
        })
      })
      const res = await server.inject({
        method: 'GET'
      , url: `/mpmc/${id}`
      })

      expect(res.statusCode).toBe(200)
      expect(res.body).toBe(message)
    })
  })
})
