import { buildServer } from '@src/server'
import { prepareDatabases, resetEnvironment } from '@test/utils'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabases()
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
