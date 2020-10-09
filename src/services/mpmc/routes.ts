import { FastifyPluginAsync } from 'fastify'
import { ChannelManager } from './channel-manager'
import urlencodedParser from '@src/urlencoded-parser'
import { idSchema } from '@src/schema'

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
      await manager.put(req.params.id, req.body)
      reply.status(204).send()
    }
  )
}
