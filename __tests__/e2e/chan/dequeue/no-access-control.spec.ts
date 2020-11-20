import { buildServer } from '@src/server'
import { prepareDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'

jest.mock('@dao/access-control/database')
jest.mock('@dao/json-schema/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareDatabases()
})

describe('no access control', () => {
  it('200', async () => {
    const server = await buildServer()
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
