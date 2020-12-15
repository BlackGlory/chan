import { buildServer } from '@src/server'
import { resetDatabases, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await resetDatabases()
})

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need write tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          const server = await buildServer()
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          setImmediate(() => {
            server.inject({
              method: 'GET'
            , url: `/chan/${id}`
            })
          })
          const res = await server.inject({
            method: 'POST'
          , url: `/chan/${id}`
          , query: { token }
          , headers: {
              'Content-Type': 'text/plain'
            }
          , payload: message
          })

          expect(res.statusCode).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          const server = await buildServer()
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          const res = await server.inject({
            method: 'POST'
          , url: `/chan/${id}`
          , query: { token: 'bad' }
          , headers: {
              'Content-Type': 'text/plain'
            }
          , payload: message
          })

          expect(res.statusCode).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          const server = await buildServer()
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          const res = await server.inject({
            method: 'POST'
          , url: `/chan/${id}`
          , headers: {
              'Content-Type': 'text/plain'
            }
          , payload: message
          })

          expect(res.statusCode).toBe(401)
        })
      })
    })

    describe('id does not need write tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.CHAN_WRITE_TOKEN_REQUIRED = 'true'
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

          expect(res.statusCode).toBe(401)
        })
      })

      describe('WRITE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const message = 'message'
          const server = await buildServer()

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
    })
  })

  describe('disabled', () => {
    describe('id need write tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const id = 'id'
          const token = 'token'
          const message = 'message'
          const server = await buildServer()
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

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
    })

    describe('id does not need write tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.CHAN_WRITE_TOKEN_REQUIRED = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          const server = await buildServer()
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

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
    })
  })
})
