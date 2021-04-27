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
    describe('namespace need read tokens', () => {
      describe('token matched', () => {
        it('200', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          setImmediate(async () => {
            await fetch(post(
              url(getAddress())
            , pathname(`/chan/${namespace}`)
            , text(message)
            ))
          })
          const res = await fetch(get(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          , searchParam('token', token)
          ))

          expect(res.status).toBe(200)
          expect(await toText(res)).toBe(message)
        })
      })

      describe('token does not matched', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          , searchParam(token, 'bad')
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('no token', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          const namespace = 'namespace'
          const token = 'token'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })
    })

    describe('namespace does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('401', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.CHAN_READ_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'

          const res = await fetch(get(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          ))

          expect(res.status).toBe(401)
        })
      })

      describe('READ_TOKEN_REQUIRED=false', () => {
        it('200', async () => {
          process.env.CHAN_TOKEN_BASED_ACCESS_CONTROL = 'true'
          process.env.CHAN_READ_TOKEN_REQUIRED = 'false'
          const namespace = 'namespace'
          const message = 'message'

          setImmediate(async () => {
            await fetch(post(
              url(getAddress())
            , pathname(`/chan/${namespace}`)
            , text(message)
            ))
          })
          const res = await fetch(get(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          ))

          expect(res.status).toBe(200)
          expect(await toText(res)).toBe(message)
        })
      })
    })
  })

  describe('disabled', () => {
    describe('namespace need read tokens', () => {
      describe('no token', () => {
        it('200', async () => {
          const namespace = 'namespace'
          const token = 'token'
          const message = 'message'
          await AccessControlDAO.setReadTokenRequired(namespace, true)
          await AccessControlDAO.setReadToken({ namespace, token })

          setImmediate(async () => {
            await fetch(post(
              url(getAddress())
            , pathname(`/chan/${namespace}`)
            , text(message)
            ))
          })
          const res = await fetch(get(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          ))

          expect(res.status).toBe(200)
          expect(await toText(res)).toBe(message)
        })
      })
    })

    describe('namespace does not need read tokens', () => {
      describe('READ_TOKEN_REQUIRED=true', () => {
        it('200', async () => {
          process.env.CHAN_READ_TOKEN_REQUIRED = 'true'
          const namespace = 'namespace'
          const message = 'message'

          setImmediate(async () => {
            await fetch(post(
              url(getAddress())
            , pathname(`/chan/${namespace}`)
            , text(message)
            ))
          })
          const res = await fetch(get(
            url(getAddress())
          , pathname(`/chan/${namespace}`)
          ))

          expect(res.status).toBe(200)
          expect(await toText(res)).toBe(message)
        })
      })
    })
  })
})
