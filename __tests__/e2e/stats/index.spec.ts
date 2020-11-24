import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'

jest.mock('@dao/sqlite3/database')

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('stats', () => {
  describe('GET /stats', () => {
    it('200', async () => {
      const server = await buildServer()

      const res = await server.inject({
        method: 'GET'
      , url: '/stats'
      })

      expect(res.statusCode).toBe(200)
      expect(res.json()).toMatchObject({
        memoryUsage: expect.anything()
      , cpuUsage: expect.anything()
      , resourceUsage: expect.anything()
      })
    })
  })
})
