import { FastifyPluginAsync } from 'fastify'
import { idSchema, tokenSchema } from '@src/schema'
import { IPackage } from './types'

export const routes: FastifyPluginAsync<{ Core: ICore }> = async function routes(server, { Core }) {
  server.get<{
    Params: { id: string }
    Querystring: { token?: string }
  }>(
    '/chan/:id'
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

      try {
        await Core.Blacklist.check(id)
        await Core.Whitelist.check(id)
        await Core.TBAC.checkReadPermission(id, token)
      } catch (e) {
        if (e instanceof Core.Error.Unauthorized) return reply.status(401).send()
        if (e instanceof Core.Error.Forbidden) return reply.status(403).send()
        throw e
      }

      const value = await Core.Chan.dequeue(id) as IPackage
      if (value.type) reply.header('content-type', value.type)
      reply.send(value.payload)
    }
  )
}
