import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import {
  LIST_BASED_ACCESS_CONTROL
, ListBasedAccessControl
, TOKEN_BASED_ACCESS_CONTROL
, DISABLE_NO_TOKENS
, JSON_VALIDATION
, DEFAULT_JSON_SCHEMA
, JSON_PAYLOAD_ONLY
, ENQUEUE_PAYLOAD_LIMIT
} from '@env'
import Ajv from 'ajv'
import { getErrorResult } from 'return-style'

export const routes: FastifyPluginAsync<{
  MPMC: IMPMC<{ type?: string; payload: string }>
  DAO: IDataAccessObject
}> = async function routes(server, { MPMC, DAO }) {
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
    '/mpmc/:id'
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
      const token = req.query.token

      if (LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Blacklist) {
        if (await DAO.inBlacklist(req.params.id)) return reply.status(403).send()
      } else if (LIST_BASED_ACCESS_CONTROL() === ListBasedAccessControl.Whitelist) {
        if (!await DAO.inWhitelist(req.params.id)) return reply.status(403).send()
      }

      if (TOKEN_BASED_ACCESS_CONTROL()) {
        if (await DAO.hasEnqueueTokens(id)) {
          if (token) {
            if (!await DAO.matchEnqueueToken({ token, id })) return reply.status(401).send()
          } else {
            return reply.status(401).send()
          }
        } else {
          if (DISABLE_NO_TOKENS()) {
            if (!await DAO.hasDequeueTokens(id)) return reply.status(403).send()
          }
        }
      }

      if (JSON_VALIDATION()) {
        const specificJsonSchema= await DAO.getJsonSchema(req.params.id)
        if (req.headers['content-type']?.toLowerCase().startsWith('application/json')) {
          const [err, json] = getErrorResult(() => JSON.parse(req.body))
          if (err) return reply.status(400).send(err.message)

          const schema = specificJsonSchema ?? DEFAULT_JSON_SCHEMA()
          if (schema) {
            const ajv = new Ajv()
            const valid = ajv.validate(JSON.parse(schema), json)
            if (!valid) {
              return reply.status(400).send(ajv.errorsText())
            }
          }
        } else if (specificJsonSchema) {
          return reply.status(400).send('content-type must be application/json')
        }
      }

      await MPMC.enqueue(req.params.id, {
        type: req.headers['content-type']
      , payload: req.body
      })
      reply.status(204).send()
    }
  )
}
