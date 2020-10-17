import { FastifyPluginAsync } from 'fastify'
import { idSchema } from '@src/schema'
import DAO from '@src/dao'

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
  , async (req, reply) => {
    const result = await DAO.getAllBlacklistItems()
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
  , async (req, reply) => {
      await DAO.addBlacklistItem(req.params.id)
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
  , async (req, reply) => {
      await DAO.removeBlacklistItem(req.params.id)
      reply.status(204).send()
    }
  )
}
