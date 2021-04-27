import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { AccessControlDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get, post } from 'extra-request'
import { url, pathname, text } from 'extra-request/lib/es2018/transformers'
import { toText } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('whitelist', () => {
  describe('enabled', () => {
    describe('namespace in whitelist', () => {
      it('200', async () => {
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'
        const message = 'message'
        await AccessControlDAO.addWhitelistItem(namespace)

        setImmediate(async () => {
          fetch(post(
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

    describe('namespace not in whitelist', () => {
      it('403', async () => {
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'whitelist'
        const namespace = 'namespace'

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/chan/${namespace}`)
        ))

        expect(res.status).toBe(403)
      })
    })
  })

  describe('disabled', () => {
    describe('namespace not in whitelist', () => {
      it('403', async () => {
        const namespace = 'namespace'
        const message = 'message'
        await AccessControlDAO.addWhitelistItem(namespace)

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
