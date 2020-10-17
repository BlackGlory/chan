import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import {
  LIST_BASED_ACCESS_CONTROL
, RBAC
, TOKEN_BASED_ACCESS_CONTROL
, DISABLE_NO_TOKENS
, JSON_SCHEMA_VALIDATION
, DEFAULT_JSON_SCHEMA
, JSON_PAYLOAD_ONLY
} from '@config'
import Ajv from 'ajv'
import DAO from '@dao'
import type { ChannelManager } from '@src/core/channel-manager'

export const routes: FastifyPluginAsync<{
  manager: ChannelManager<{ type?: string; payload: string }>
}> = async function routes(server, { manager }) {
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
          'content-type': {
            type: 'string'
          , enum: JSON_PAYLOAD_ONLY()
                ? ['application/json']
                : [
                    'application/json'
                  , 'text/plain'
                  , 'application/x-www-form-urlencoded'
                  ]
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.query.token

      if (LIST_BASED_ACCESS_CONTROL() === RBAC.Blacklist) {
        if (await DAO.inBlacklist(req.params.id)) return reply.status(403).send()
      } else if (LIST_BASED_ACCESS_CONTROL() === RBAC.Whitelist) {
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

      if (JSON_SCHEMA_VALIDATION()) {
        const specificJsonSchema= await DAO.getJsonSchema(req.params.id)
        if (req.headers['content-type']?.includes('application/json')) {
          const schema = specificJsonSchema ?? DEFAULT_JSON_SCHEMA()
          if (schema) {
            const ajv = new Ajv()
            const valid = ajv.validate(JSON.parse(schema), req.body)
            if (!valid) {
              return reply.status(400).send(ajv.errorsText())
            }
          }
        } else if (specificJsonSchema) {
          return reply.status(400).send('content-type must be application/json')
        }
      }

      await manager.put(req.params.id, {
        type: req.headers['content-type']
      , payload: req.body
      })
      reply.status(204).send()
    }
  )
}