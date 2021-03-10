import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get, post } from 'extra-request'
import { url, pathname, text, searchParam } from 'extra-request/lib/es2018/transformers'
import { toText } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('token-based access control', () => {
  describe('enabled', () => {
    describe('id need write tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          setImmediate(async () => {
            await fetch(get(
              url(getAddress())
            , pathname(`/chan/${id}`)
            ))
          })
          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${id}`)
          , searchParam('token', token)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${id}`)
          , searchParam('token', 'bad')
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(401)
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

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('WRITE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const id = 'id'
          const message = 'message'

          setImmediate(async () => {
            await fetch(get(
              url(getAddress())
            , pathname(`/chan/${id}`)
            ))
          })
          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
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
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          setImmediate(async () => {
            await fetch(get(
              url(getAddress())
            , pathname(`/chan/${id}`)
            ))
          })
          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
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
          await AccessControlDAO.setWriteTokenRequired(id, true)
          await AccessControlDAO.setWriteToken({ id, token })

          setImmediate(async () => {
            await fetch(get(
              url(getAddress())
            , pathname(`/chan/${id}`)
            ))
          })
          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
