import { buildServer } from '@src/server'
import { prepareAccessControlDatabase, resetEnvironment } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'

jest.mock('@dao/access-control/database')
expect.extend(matchers)

beforeEach(async () => {
  resetEnvironment()
  await prepareAccessControlDatabase()
})

describe('token-based access control', () => {
  describe('id has enqueue tokens', () => {
    describe('token matched', () => {
      it('204', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = await buildServer()
        await AccessControlDAO.setWriteToken({ id, token })

        setImmediate(() => {
          server.inject({
            method: 'GET'
          , url: `/chan/${id}`
          , query: { token }
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
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = await buildServer()
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
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = await buildServer()
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

  describe('id does not have enqueue tokens', () => {
    describe('id has dequeue tokens', () => {
      it('204', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = await buildServer()
        await AccessControlDAO.setReadToken({ id, token })

        setImmediate(() => {
          server.inject({
            method: 'GET'
          , url: `/chan/${id}`
          , query: { token }
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

    describe('id has no tokens', () => {
      describe('TOKEN_REQUIRED', () => {
        it('403', async () => {
          process.env.CHAN_ADMIN_PASSWORD = 'password'
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.CHAN_TOKEN_REQUIRED = 'true'
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

          expect(res.statusCode).toBe(403)
        })
      })

      describe('not TOKEN_REQUIRED', () => {
        it('204', async () => {
          process.env.CHAN_ADMIN_PASSWORD = 'password'
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
})
