import { startService, stopService, getAddress } from '@test/utils'
import { matchers } from 'jest-json-schema'
import { JsonSchemaDAO } from '@dao'
import { fetch } from 'extra-fetch'
import { get, post } from 'extra-request'
import { url, pathname, json, text, header } from 'extra-request/lib/es2018/transformers'
import { toJSON } from 'extra-response'

jest.mock('@dao/config-in-sqlite3/database')
expect.extend(matchers)

// 由于服务启动时会读取环境变量 CHAN_JSON_PAYLOAD_ONLY
// 因此环境变量必须在服务启动前设置, 这迫使测试用例手动启动服务
afterEach(stopService)

describe('no access control', () => {
  describe('CHAN_JSON_VALIDATION=true', () => {
    describe('CHAN_JSON_DEFAULT_SCHEMA', () => {
      describe('Content-Type: application/json', () => {
        describe('valid', () => {
          it('204', async () => {
            process.env.CHAN_JSON_VALIDATION = 'true'
            process.env.CHAN_DEFAULT_JSON_SCHEMA = JSON.stringify({
              type: 'number'
            })
            await startService()
            const id = 'id'
            const message = 123

            setImmediate(async () => {
              await fetch(get(
                url(getAddress())
              , pathname(`/chan/${id}`)
              ))
            })
            const res = await fetch(post(
              url(getAddress())
            , pathname(`/chan/${id}`)
            , json(message)
            ))

            expect(res.status).toBe(204)
          })
        })

        describe('invalid', () => {
          it('400', async () => {
            process.env.CHAN_JSON_VALIDATION = 'true'
            process.env.CHAN_DEFAULT_JSON_SCHEMA = JSON.stringify({
              type: 'number'
            })
            await startService()
            const id = 'id'
            const message = ' "message" '

            const res = await fetch(post(
              url(getAddress())
            , pathname(`/chan/${id}`)
            , json(message)
            ))

            expect(res.status).toBe(400)
          })
        })
      })

      describe('other Content-Type', () => {
        it('204', async () => {
          process.env.CHAN_JSON_VALIDATION = 'true'
          process.env.CHAN_DEFAULT_JSON_SCHEMA = JSON.stringify({
            type: 'number'
          })
          await startService()
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

    describe('id has JSON Schema', () => {
      describe('Content-Type: application/json', () => {
        describe('valid JSON', () => {
          it('204', async done => {
            process.env.CHAN_JSON_VALIDATION = 'true'
            await startService()
            const id = 'id'
            const schema = { type: 'string' }
            const message = 'message'
            await JsonSchemaDAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })

            setImmediate(async () => {
              const res = await fetch(get(
                url(getAddress())
              , pathname(`/chan/${id}`)
              ))
              expect(res.headers.get('content-type')).toMatch('application/json')
              expect(await toJSON(res)).toBe(message)
              done()
            })
            const res = await fetch(post(
              url(getAddress())
            , pathname(`/chan/${id}`)
            , json(message)
            ))

            expect(res.status).toBe(204)
          })
        })

        describe('invalid JSON', () => {
          it('400', async () => {
            process.env.CHAN_JSON_VALIDATION = 'true'
            await startService()
            const id = 'id'
            const schema = { type: 'string' }
            const message = 'message'
            await JsonSchemaDAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })

            const res = await fetch(post(
              url(getAddress())
            , pathname(`/chan/${id}`)
            , text(message)
            , header('Content-Type', 'application/json')
            ))

            expect(res.status).toBe(400)
          })
        })
      })

      describe('other Content-Type', () => {
        it('415', async () => {
          process.env.CHAN_JSON_VALIDATION = 'true'
          await startService()
          const id = 'id'
          const schema = { type: 'string' }
          const message = 'message'
          await JsonSchemaDAO.setJsonSchema({
            id
          , schema: JSON.stringify(schema)
          })

          const res = await fetch(post(
            url(getAddress())
          , pathname(`/chan/${id}`)
          , text(message)
          ))

          expect(res.status).toBe(415)
        })
      })
    })

    describe('id does not have JSON Schema', () => {
      describe('Content-Type: application/json', () => {
        describe('valid JSON', () => {
          it('204', async done => {
            process.env.CHAN_JSON_VALIDATION = 'true'
            await startService()
            const id = 'id'
            const schema = { type: 'string' }
            const message = 'message'
            await JsonSchemaDAO.setJsonSchema({
              id
            , schema: JSON.stringify(schema)
            })

            setImmediate(async () => {
              const res = await fetch(get(
                url(getAddress())
              , pathname(`/chan/${id}`)
              ))
              expect(res.headers.get('content-type')).toMatch('application/json')
              expect(await toJSON(res)).toBe(message)
              done()
            })
            const res = await fetch(post(
              url(getAddress())
            , pathname(`/chan/${id}`)
            , json(message)
            ))

            expect(res.status).toBe(204)
          })
        })

        describe('invalid JSON', () => {
          it('400', async () => {
            process.env.CHAN_JSON_VALIDATION = 'true'
            await startService()
            const id = 'id'
            const message = 'message'

            const res = await fetch(post(
              url(getAddress())
            , pathname(`/chan/${id}`)
            , text(message)
            , header('Content-Type', 'application/json')
            ))

            expect(res.status).toBe(400)
          })
        })
      })
    })
  })

  describe('CHAN_JSON_PAYLOAD_ONLY', () => {
    describe('Content-Type: application/json', () => {
      it('accept , return 204', async done => {
        process.env.CHAN_JSON_PAYLOAD_ONLY = 'true'
        await startService()
        const id = 'id'
        const message = 'message'

        setImmediate(async () => {
          const res = await fetch(get(
            url(getAddress())
          , pathname(`/chan/${id}`)
          ))
          expect(res.headers.get('content-type')).toMatch('application/json')
          done()
        })
        const res = await fetch(post(
          url(getAddress())
        , pathname(`/chan/${id}`)
        , json(message)
        ))

        expect(res.status).toBe(204)
      })
    })

    describe('other Content-Type', () => {
      it('400', async () => {
        process.env.CHAN_JSON_PAYLOAD_ONLY = 'true'
        await startService()
        const id = 'id'
        const message = 'message'

        const res = await fetch(post(
          url(getAddress())
        , pathname(`/chan/${id}`)
        , text(message)
        ))

        expect(res.status).toBe(400)
      })
    })
  })

  describe('Content-Type', () => {
    it('reflect content-type', async done => {
      await startService()
      const id = 'id'
      const message = 'message'

      setImmediate(async () => {
        const res = await fetch(get(
          url(getAddress())
        , pathname(`/chan/${id}`)
        ))
        expect(res.headers.get('content-type')).toMatch('apple/banana')
        done()
      })
      const res = await fetch(post(
        url(getAddress())
      , pathname(`/chan/${id}`)
      , text(message)
      , header('Content-Type', 'apple/banana')
      )
)

      expect(res.status).toBe(204)
    })
  })
})
