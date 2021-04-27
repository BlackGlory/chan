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
    describe('namespace need write tokens', () => {
      describe('token matched', () => {
        it('204', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          setImmediate(async () => {
            await fetch(get(
              url(getAddress())
            , pathname(`/chan/${namespace}`)
            ))
          })
          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          , searchParam('token', token)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          , searchParam('token', 'bad')
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need write tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.CHAN_WRITE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const message = 'message'

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('WRITE_TOKEN_REQUIRED=false', () => {
        it('204', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const message = 'message'

          setImmediate(async () => {
            await fetch(get(
              url(getAddress())
            , pathname(`/chan/${namespace}`)
            ))
          })
          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('namespace need write tokens', () => {
      describe('no token', () => {
        it('204', async () => {
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          setImmediate(async () => {
            await fetch(get(
              url(getAddress())
            , pathname(`/chan/${namespace}`)
            ))
          })
          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })

    describe('namespace does not need write tokens', () => {
      describe('WRITE_TOKEN_REQUIRED=true', () => {
        it('204', async () => {
          process.env.CHAN_WRITE_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setWriteTokenRequired(namespace, true)
          await AccessControlDAO.setWriteToken({ namespace, token })

          setImmediate(async () => {
            await fetch(get(
              url(getAddress())
            , pathname(`/chan/${namespace}`)
            ))
          })
          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          , text(message)
          ))

          expect(res.status).toBe(204)
        })
      })
    })
  })
})
