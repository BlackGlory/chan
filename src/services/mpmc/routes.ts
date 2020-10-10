import { FastifyPluginAsync } from 'fastify'
import { ChannelManager } from './channel-manager'
import urlencodedParser from '@src/urlencoded-parser'
import { idSchema } from '@src/schema'
import { ADMIN_PASSWORD, LIST_BASED_ACCESS_CONTROL, RBAC } from '@src/config'
import { inBlacklist } from '@src/dao/blacklist'
import { inWhitelist } from '@src/dao/whitelist'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.register(urlencodedParser, { parseAs: 'string' })
  const manager = new ChannelManager<string>()

  server.get<{ Params: { id: string }}>(
    '/mpmc/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          200: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      if (ADMIN_PASSWORD()) {
        if (LIST_BASED_ACCESS_CONTROL() === RBAC.Blacklist) {
          if (inBlacklist(req.params.id)) return reply.status(403).send()
        } else if (LIST_BASED_ACCESS_CONTROL() === RBAC.Whitelist) {
          if (!inWhitelist(req.params.id)) return reply.status(403).send()
        }
      }
      const value = await manager.take(req.params.id)
      reply.send(value)
    }
  )

  server.post<{
    Params: { id: string }
  , Body: string
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
      if (ADMIN_PASSWORD()) {
        if (LIST_BASED_ACCESS_CONTROL() === RBAC.Blacklist) {
          if (inBlacklist(req.params.id)) return reply.status(403).send()
        } else if (LIST_BASED_ACCESS_CONTROL() === RBAC.Whitelist) {
          if (!inWhitelist(req.params.id)) return reply.status(403).send()
        }
      }
      await manager.put(req.params.id, req.body)
      reply.status(204).send()
    }
  )
}
