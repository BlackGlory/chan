import { startService, stopService, getServer } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
    const server = getServer()
    const id = 'id'
    const message = 'message'

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
