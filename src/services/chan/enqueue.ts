import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import { JSON_PAYLOAD_ONLY, ENQUEUE_PAYLOAD_LIMIT } from '@env'
import { IPackage } from './types'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  // overwrite application/json parser
  server.addContentTypeParser(
    'application/json'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body))

  server.addContentTypeParser(
    '*'
  , { parseAs: 'string' }
  , (req, body, done) => done(null, body))

  server.post<{
    Params: { id: string }
    Querystring: { token?: string }
    Body: string
  }>(
    '/chan/:id'
  , {
      schema: {
        params: { id: idSchema }
      , querystring: { token: tokenSchema }
      , headers: {
          'content-type': JSON_PAYLOAD_ONLY()
                          ? { type: 'string', pattern: '^application/json' }
                          : { type: 'string' }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    , bodyLimit: ENQUEUE_PAYLOAD_LIMIT()
    }
  , async (req, reply) => {
      const id = req.params.id
      const payload = req.body
      const token = req.query.token

      try {
        await Core.Blacklist.check(id)
        await Core.Whitelist.check(id)
        await Core.TBAC.checkWritePermission(id, token)
        if (Core.JsonSchema.isEnabled()) {
          if (isJSONPayload()) {
            await Core.JsonSchema.validate(id, payload)
          } else {
            if (await Core.JsonSchema.get(id)) {
              throw new Error('This id only accepts application/json')
            }
          }
        }
      } catch (e) {
        if (e instanceof Core.Error.Unauthorized) return reply.status(401).send()
        if (e instanceof Core.Error.Forbidden) return reply.status(403).send()
        if (e instanceof Error) return reply.status(400).send(e.message)
        throw e
      }

      const pkg: IPackage = {
        type: req.headers['content-type'] ?? 'application/octet-stream'
      , payload
      }
      await Core.Chan.enqueue(id, pkg)
      reply.status(204).send()

      function isJSONPayload(): boolean {
        const contentType = req.headers['content-type']
        if (!contentType) return false
        return contentType
          .toLowerCase()
          .startsWith('application/json')
      }
    }
  )
}
