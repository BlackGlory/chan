import { FastifyPluginAsync } from 'fastify'
import { ChannelManager } from './channel-manager'
import urlencodedParser from '@src/urlencoded-parser'
import { idSchema, tokenSchema } from '@src/schema'
import {
  ADMIN_PASSWORD
, LIST_BASED_ACCESS_CONTROL
, RBAC
, TOKEN_BASED_ACCESS_CONTROL
, DISABLE_NO_TOKENS
} from '@src/config'
import { inBlacklist } from '@src/dao/blacklist'
import { inWhitelist } from '@src/dao/whitelist'
import {
  hasEnqueueTokens
, hasDequeueTokens
, matchEnqueueToken
, matchDequeueToken
} from '@src/dao/token-based-access-control'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.register(urlencodedParser, { parseAs: 'string' })
  const manager = new ChannelManager<string>()

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

      if (ADMIN_PASSWORD()) {
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
      }

      const value = await manager.take(id)
      reply.send(value)
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
      , body: { type: 'string' }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.query.token

      if (ADMIN_PASSWORD()) {
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
      }

      await manager.put(req.params.id, req.body)
      reply.status(204).send()
    }
  )
}
