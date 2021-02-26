import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('metrics', () => {
  describe('GET /metrics', () => {
    it('200', async () => {
      const server = await buildServer()

      const res = await server.inject({
        method: 'GET'
      , url: '/metrics'
      })

      expect(res.statusCode).toBe(200)
      expect(res.json()).toEqual({
        memoryUsage: expect.anything()
      , cpuUsage: expect.anything()
      , resourceUsage: expect.anything()
      })
    })
  })
})
