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
  describe('id has dequeue tokens', () => {
    describe('token matched', () => {
      it('200', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = await buildServer()
        await AccessControlDAO.setReadToken({ id, token })

        setImmediate(() => {
          server.inject({
            method: 'POST'
          , url: `/chan/${id}`
          , payload: message
          , headers: {
              'Content-Type': 'text/plain'
            }
          })
        })
        const res = await server.inject({
          method: 'GET'
        , url: `/chan/${id}`
        , query: { token }
        })

        expect(res.statusCode).toBe(200)
        expect(res.body).toBe(message)
      })
    })

    describe('token does not matched', () => {
      it('401', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const server = await buildServer()
        await AccessControlDAO.setReadToken({ id, token })

        const res = await server.inject({
          method: 'GET'
        , url: `/chan/${id}`
        , query: { token: 'bad' }
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
        const server = await buildServer()
        await AccessControlDAO.setReadToken({ id, token })

        const res = await server.inject({
          method: 'GET'
        , url: `/chan/${id}`
        })

        expect(res.statusCode).toBe(401)
      })
    })
  })

  describe('id does not have dequeue tokens', () => {
    describe('id has enqueue tokens', () => {
      it('200', async () => {
        process.env.CHAN_ADMIN_PASSWORD = 'password'
        process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
        const id = 'id'
        const token = 'token'
        const message = 'message'
        const server = await buildServer()
        await AccessControlDAO.setWriteToken({ id, token })

        setImmediate(() => {
          server.inject({
            method: 'POST'
          , url: `/chan/${id}`
          , payload: message
          , query: { token }
          , headers: {
              'Content-Type': 'text/plain'
            }
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

    describe('id has no tokens', () => {
      describe('DISABLE_NO_TOKENS', () => {
        it('403', async () => {
          process.env.CHAN_ADMIN_PASSWORD = 'password'
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.CHAN_DISABLE_NO_TOKENS = 'true'
          const id = 'id'
          const server = await buildServer()

          const res = await server.inject({
            method: 'GET'
          , url: `/chan/${id}`
          })

          expect(res.statusCode).toBe(403)
        })
      })

      describe('not DISABLE_NO_TOKENS', () => {
        it('200', async () => {
          process.env.CHAN_ADMIN_PASSWORD = 'password'
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const message = 'message'
          const server = await buildServer()

          setImmediate(() => {
            server.inject({
              method: 'POST'
            , url: `/chan/${id}`
            , payload: message
            , headers: {
                'Content-Type': 'text/plain'
              }
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
    })
  })
})
