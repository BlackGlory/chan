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

describe('blackllist', () => {
  describe('enabled', () => {
    describe('id in blacklist', () => {
      it('403', async () => {
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        await AccessControlDAO.addBlacklistItem(id)

        const res = await fetch(get(
          url(getAddress())
        , pathname(`/chan/${id}`)
        ))

        expect(res.status).toBe(403)
      })
    })

    describe('id not in blacklist', () => {
      it('200', async () => {
        process.env.CHAN_LIST_BASED_ACCESS_CONTROL = 'blacklist'
        const id = 'id'
        const message = 'message'

        setImmediate(async () => {
          await fetch(post(
            url(getAddress())
          , pathname(`/chan/${id}`)
          , text(message)
          ))
        })
        const res = await fetch(get(
          url(getAddress())
        , pathname(`/chan/${id}`)
        ))

        expect(res.status).toBe(200)
        expect(await toText(res)).toBe(message)
      })
    })
  })

  describe('disabled', () => {
    describe('id in blacklist', () => {
      it('200', async () => {
        const id = 'id'
        const message = 'message'
        await AccessControlDAO.addBlacklistItem(id)

        setImmediate(async () => {
          await fetch(post(
            url(getAddress())
          , pathname(`/chan/${id}`)
          , text(message)
          ))
        })
        const res = await fetch(get(
          url(getAddress())
        , pathname(`/chan/${id}`)
        ))

        expect(res.status).toBe(200)
        expect(await toText(res)).toBe(message)
      })
    })
  })
})
