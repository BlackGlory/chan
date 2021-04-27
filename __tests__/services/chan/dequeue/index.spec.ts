import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { fetch } from 'extra-fetch'
import { get, post } from 'extra-request'
import { url, pathname, text } from 'extra-request/lib/es2018/transformers'
import { toText } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

beforeEach(startService)
afterEach(stopService)

describe('no access control', () => {
  it('200', async () => {
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
