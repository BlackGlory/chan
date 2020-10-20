import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import DAO from '@dao'

jest.mock('@dao/sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('whitelist', () => {
  describe('id in whitelist', () => {
    it('200', async () => {
      process.env.MPMC_ADMIN_PASSWORD = 'password'
      process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const id = 'id'
      const message = 'message'
      const server = buildServer()
      await DAO.addWhitelistItem(id)

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

  describe('id not in whitelist', () => {
    it('403', async () => {
      process.env.MPMC_ADMIN_PASSWORD = 'password'
      process.env.MPMC_LIST_BASED_ACCESS_CONTROL = 'whitelist'
      const id = 'id'
      const server = buildServer()

      const res = await server.inject({
        method: 'GET'
      , url: `/mpmc/${id}`
      })

      expect(res.statusCode).toBe(403)
    })
  })
})
