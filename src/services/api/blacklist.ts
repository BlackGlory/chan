import { idSchema } from '@src/schema'
import * as Blacklist from '@src/dao/blacklist'
import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.get(
    '/blacklist'
  , {
      schema: {
        response: {
          200: {
            type: 'array'
          , items: { type: 'string' }
          }
        }
      }
    }
  , (req, reply) => {
    const result = Blacklist.getAllBlacklistItems()
    reply.send(result)
  })

  server.put<{ Params: { id: string }}>(
    '/blacklist/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
      Blacklist.addBlacklistItem(req.params.id)
      reply.status(204).send()
    }
  )

  server.delete<{ Params: { id: string }}>(
    '/blacklist/:id'
  , {
      schema: {
        params: {
          type: 'object'
        , properties: {
            id: idSchema
          }
        }
      , response: {
          204: { type: 'null' }
        }
      }
    }
  , (req, reply) => {
      Blacklist.removeBlacklistItem(req.params.id)
      reply.status(204).send()
    }
  )
}
