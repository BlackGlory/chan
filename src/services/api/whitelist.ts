import { idSchema } from '@src/schema'
import * as Whitelist from '@src/dao/whitelist'
import { FastifyPluginAsync } from 'fastify'

export const routes: FastifyPluginAsync = async function routes(server, options) {
  server.get(
    '/whitelist'
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
    const result = Whitelist.getAllWhitelistItems()
    reply.send(result)
  })

  server.put<{ Params: { id: string }}>(
    '/whitelist/:id'
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
      Whitelist.addWhitelistItem(req.params.id)
      reply.status(204).send()
    }
  )

  server.delete<{ Params: { id: string }}>(
    '/whitelist/:id'
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
    Whitelist.removeWhitelistItem(req.params.id)
    reply.status(204).send()
  })
}
