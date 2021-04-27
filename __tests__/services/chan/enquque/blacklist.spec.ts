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

describe('blacklist', () => {
  describe('enabled', () => {
    describe('namespace in blacklist', () => {
      it('403', async () => {
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const namespace = 'namespace'
        const message = 'message'
        await AccessControlDAO.addBlacklistItem(namespace)

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/chan/${namespace}`)
        , text(message)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('namespace not in blacklist', () => {
      it('204', async () => {
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'blacklist'
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

  describe('disabled', () => {
    describe('namespace in blacklist', () => {
      it('204', async () => {
        const namespace = 'namespace'
        const message = 'message'
        await AccessControlDAO.addBlacklistItem(namespace)

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
