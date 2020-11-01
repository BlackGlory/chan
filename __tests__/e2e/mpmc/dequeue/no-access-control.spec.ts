import { buildServer } from '@src/server'
import { prepareDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/config/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabase()
})

describe('no access control', () => {
  it('200', async () => {
    const server = await buildServer()
    const id = 'id'
    const message = 'message'

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
