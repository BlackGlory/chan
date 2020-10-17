import { FastifyPluginAsync } from 'fastify'
import { ChannelManager } from './channel-manager'
import urlencodedParser from '@src/urlencoded-parser'
import { idSchema, tokenSchema } from '@src/schema'
import {
  LIST_BASED_ACCESS_CONTROL
, RBAC
, TOKEN_BASED_ACCESS_CONTROL
, DISABLE_NO_TOKENS
, JSON_SCHEMA
, JSON_ONLY
} from '@src/config'
import { inBlacklist } from '@src/dao/blacklist'
import { inWhitelist } from '@src/dao/whitelist'
import {
  hasEnqueueTokens
, hasDequeueTokens
, matchEnqueueToken
, matchDequeueToken
} from '@src/dao/token-based-access-control'
import Ajv from 'ajv'
import { getErrorResult } from 'return-style'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.register(urlencodedParser, { parseAs: 'string' })
  const manager = new ChannelManager<{ type?: string; payload: string }>()

  server.get<{
    Params: { id: string }
    Querystring: { token?: string }
  }>(
    '/mpmc/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , querystring: {
          type: 'object'
        , properties: {
            token: tokenSchema
          }
        }
      , response: {
          200: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.query.token

      if (LIST_BASED_ACCESS_CONTROL() === RBAC.Blacklist) {
        if (inBlacklist(id)) return reply.status(403).send()
      } else if (LIST_BASED_ACCESS_CONTROL() === RBAC.Whitelist) {
        if (!inWhitelist(id)) return reply.status(403).send()
      }

      if (TOKEN_BASED_ACCESS_CONTROL()) {
        if (hasDequeueTokens(id)) {
          if (token) {
            if (!matchDequeueToken({ token, id })) return reply.status(401).send()
          } else {
            return reply.status(401).send()
          }
        } else {
          if (DISABLE_NO_TOKENS()) {
            if (!hasEnqueueTokens(id)) return reply.status(403).send()
          }
        }
      }

      const value = await manager.take(id)
      if (value.type) reply.header('content-type', value.type)
      reply.send(value.payload)
    }
  )

  server.post<{
    Params: { id: string }
    Querystring: { token?: string }
    Body: string
  }>(
    '/mpmc/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , headers: {
          'content-type': {
            type: 'string'
          , enum: JSON_ONLY()
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
    , preValidation(req, reply, done) {
        if (req.headers['content-type']?.includes('application/json')) {
          if (JSON_SCHEMA()) {
            const ajv = new Ajv()
            const valid = ajv.validate(JSON_SCHEMA(), req.body)
            if (!valid) {
              reply.status(400).send(ajv.errorsText())
              done()
              return
            }
          }
        }
        done()
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.query.token

      if (LIST_BASED_ACCESS_CONTROL() === RBAC.Blacklist) {
        if (inBlacklist(req.params.id)) return reply.status(403).send()
      } else if (LIST_BASED_ACCESS_CONTROL() === RBAC.Whitelist) {
        if (!inWhitelist(req.params.id)) return reply.status(403).send()
      }

      if (TOKEN_BASED_ACCESS_CONTROL()) {
        if (hasEnqueueTokens(id)) {
          if (token) {
            if (!matchEnqueueToken({ token, id })) return reply.status(401).send()
          } else {
            return reply.status(401).send()
          }
        } else {
          if (DISABLE_NO_TOKENS()) {
            if (!hasDequeueTokens(id)) return reply.status(403).send()
          }
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
