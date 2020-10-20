import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import {
  LIST_BASED_ACCESS_CONTROL
, RBAC
, TOKEN_BASED_ACCESS_CONTROL
, DISABLE_NO_TOKENS
} from '@config'

export const routes: FastifyPluginAsync<{
  mpmc: IMPMC<{ type?: string; payload: string }>
  DAO: IDataAccessObject
}> = async function routes(server, { mpmc, DAO }) {
  server.get<{
    Params: { id: string }
    Querystring: { token?: string }
  }>(
    '/mpmc/:id'
  , {
      schema: {
        params: { id: idSchema }
      , querystring: { token: tokenSchema }
      , response: {
          200: { type: 'null' }
        }
      }
    }
  , async (req, reply) => {
      const id = req.params.id
      const token = req.query.token

      if (LIST_BASED_ACCESS_CONTROL() === RBAC.Blacklist) {
        if (await DAO.inBlacklist(id)) return reply.status(403).send()
      } else if (LIST_BASED_ACCESS_CONTROL() === RBAC.Whitelist) {
        if (!await DAO.inWhitelist(id)) return reply.status(403).send()
      }

      if (TOKEN_BASED_ACCESS_CONTROL()) {
        if (await DAO.hasDequeueTokens(id)) {
          if (token) {
            if (!await DAO.matchDequeueToken({ token, id })) return reply.status(401).send()
          } else {
            return reply.status(401).send()
          }
        } else {
          if (DISABLE_NO_TOKENS()) {
            if (!await DAO.hasEnqueueTokens(id)) return reply.status(403).send()
          }
        }
      }

      const value = await mpmc.dequeue(id)
      if (value.type) reply.header('content-type', value.type)
      reply.send(value.payload)
    }
  )
}
