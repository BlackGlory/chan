import { startService, stopService, getServer } from '@test/utils'

jest.mock('@dao/config-in-sqlite3/database')

beforeEach(startService)
afterEach(stopService)

describe('robots', () => {
  describe('GET /robots.txt', () => {
    it('200', async () => {
      const server = getServer()

      const res = await server.inject({
        method: 'GET'
      , url: '/robots.txt'
      })

      expect(res.statusCode).toBe(200)
      expect(res.headers['content-type']).toBe('text/plain')
      expect(res.body).toBe(
        'User-agent: *' + '\n'
      + 'Disallow: /'
      )
    })
  })
})
